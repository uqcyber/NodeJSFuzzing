// Copyright (c) 2019, 2021, Oracle and/or its affiliates.

const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
    // Post-processing of responses
    response: (resp, options, ctx) => {
        let body = JSON.parse(resp.body);

        // The following path is used by the restfuzz command of test-juice.py 
        fs.writeFileSync(path.join(options.storeLocation, 'juiceshop_auth_token.txt'), `Bearer ${body.authentication.token}`);
    }
}
