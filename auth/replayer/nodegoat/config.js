// Copyright (c) 2019, 2021, Oracle and/or its affiliates.

const fs = require('fs');
const path = require('path');
const os = require('os');
const cookie = require('cookie');

function dump_auth_cookie(options) {
    const cookies = cookie.parse(options.jar.getCookieString(options.baseUrl));    // The following path is used by the restfuzz command of test-goat.py
    fs.writeFileSync(path.join(options.storeLocation, 'nodegoat_auth_cookie.txt'), `connect.sid=${cookies['connect.sid']}`);
}

module.exports = {
    // Fetch and dump the cookie after successful login
    // In CI, probing the app will trigger a redirect and subsequent requests will be successful
    response: (resp, options, ctx) => {
        dump_auth_cookie(options);
    },    // Fetch and dump the cookie after authentication redirection
    err_302: (options, ctx) => {
        dump_auth_cookie(options);
    }
}