// Copyright (c) 2019, 2021, Oracle and/or its affiliates.

// Disable the proxy...
process.env['http_proxy'] = '';
process.env['https_proxy'] = '';

// Determine the type of a request and replay it properly
const typeIs = require('type-is');

// To chain requests
const rp = require('request-promise');
const j = rp.jar();

// Arbitrary object to store any kind of dynamic information collected from the running analysis 
const ctx = {}

async function request(req, ctx, opts) {

    // Remove outdated info from the logged headers
    // TODO: Not log them in the first place
    delete req.meta.req.headers.cookie;
    delete req.meta.req.headers['content-length'];
    delete req.meta.req.headers['accept-encoding'];
    
    // Disable caching, to avoid 304 errorsx
    req.meta.req.headers['cache-control'] = 'no-cache';

    let req_opts = {
        baseUrl: opts.baseUrl,
        uri: req.meta.req.url,
        method: req.meta.req.method,
        jar: j,
        resolveWithFullResponse: true,
        headers: JSON.parse(JSON.stringify(req.meta.req.headers)),
        followRedirect: false,
        gzip: true, //This is optional
        storeLocation: opts.storeLocation
    }
    
    // Having an undefined body breaks GET requests.
    // Only set the body if it is not undefined
    if(req.meta.req.body) {
        switch (typeIs.is(req_opts.headers['content-type'], ['json', 'urlencoded', 'multipart', 'text/plain'])) {
        case 'urlencoded':
            (opts.replay_opts.urlencoded || ((req, req_opts, ctx) => { req_opts.form = req.meta.req.body; }))(req, req_opts, ctx);
            break;
        case 'multipart':
            (opts.replay_opts.multipart || ((req, req_opts, ctx) => { req_opts.formData = req.meta.req.body; }))(req, req_opts, ctx);
            break;
        case 'json':
            // Replace the capture value with the recorded answer
            (opts.replay_opts.json || ((req, req_opts, ctx) => { req_opts.body = JSON.stringify(req.meta.req.body); }))(req, req_opts, ctx);
        case 'text/plain':
            (opts.replay_opts.text || ((req, req_opts, ctx) => { req_opts.body = JSON.stringify(req.meta.req.body); }))(req, req_opts, ctx);
            
            // DANGER: Setting the json option JSON parses the body of the request AND the response.
            // Since some GET requests (i.e. that don't have a json content-type) also return JSON data,
            // it's better never to turn on this option because it will only cause confusion down the road.
            // For example, some response bodies will be JSON objects while other will be pure strings.
            //req_opts.json = true;
            
            break;
        default:
            throw new Error('Unsupported request type');
        }
    }
    
    // Set up formData for file-upload requests
    if (req.meta.req.file) {
        let {fieldname, originalname, mimetype, buffer, size} = req.meta.req.file
        let file = {
            value: Buffer.from(buffer.data),
            options: {
                filename: originalname,
                contentType: mimetype,
                knownLength: size
            }
        }
        req_opts.formData = {};
        req_opts.formData[fieldname] = file
    }
    
    // Include query parameters
    if (req.meta.req.query && Object.keys(req.meta.req.query).length !== 0) {
        (opts.replay_opts.query || ((req, req_opts, ctx) => { req_opts.qs = req.meta.req.query; }))(req, req_opts, ctx);
    }

    // Strip the ? from the URL
    const q_idx = req_opts.uri.indexOf('?');
    if (q_idx != -1){
        req_opts.uri = req_opts.uri.slice(0, q_idx);
    }

    // Set up headers
    if (opts.replay_opts.headers !== undefined) {
        opts.replay_opts.headers(req, req_opts, ctx);
    }
    
    //Thank god for async/await, I couldn't get this to work with promise chaining...
    let response = await rp(
        req_opts
    ).then(
        resp => {
            console.log(`The following request succeeded: ${req_opts.method} ${req_opts.uri}`);
            if (opts.replay_opts.response !== undefined) { 
                opts.replay_opts.response(resp, req_opts, ctx);
            }
            if (opts.verbose == true) {
                console.log('VERBOSE: BEGIN REQUEST DUMP');
                console.dir(req_opts)
                console.log('VERBOSE: END REQUEST DUMP');
            }
        },
        err => {
            switch (err.statusCode) {
            case 302:
                (opts.replay_opts.err_302 || ((req_opts, ctx) => { console.log(`The following request caused a redirection: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 403:
                (opts.replay_opts.err_403 || ((req_opts, ctx) => { console.log(`The following request was forbidden: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 404:
                (opts.replay_opts.err_404 || ((req_opts, ctx) => { console.log(`The following request caused a 404 error: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 406:
                (opts.replay_opts.err_406 || ((req_opts, ctx) => { console.log(`The following request caused an invalid redirection: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 410:
                (opts.replay_opts.err_410 || ((req_opts, ctx) => { console.log(`The following request triggered deprecated code: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 500:
                (opts.replay_opts.err_500 || ((req_opts, ctx) => { console.log(`The following request caused an error: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case 503:
                (opts.replay_opts.err_503 || ((req_opts, ctx) => { console.log(`The following request caused an error: ${req_opts.method} ${req_opts.uri}`); }))(req_opts, ctx);
                break;
            case undefined:
                console.log(`The following request did not return a response: ${req_opts.method} ${req_opts.uri}`);
                throw err;
            default:
                console.log(`The following request caused an error: ${req_opts.method} ${req_opts.uri}`);
                console.log(err.error);
                throw (`Unrecognized status code: ${err.statusCode}. Aborting...`);
            }
        }
    ).catch(err => {
        console.log(err)
        process.exit(1);
    });
}

async function run(opts) {
    for(const req of opts.log) {
        await request(req, ctx, opts).catch(err => {
            console.log(err);
            process.exit(1);
        });
    }
};

module.exports = run;
