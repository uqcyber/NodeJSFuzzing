// Copyright (c) 2019, 2021, Oracle and/or its affiliates.

const fs = require('fs');
const path = require('path');
const os = require('os');
const cookie = require('cookie');

module.exports = {
    headers: (req, options, ctx) => {
        const cookies = cookie.parse(options.jar.getCookieString(options.baseUrl));        // Set the CSRF token
        if (cookies['XSRF-TOKEN'] !== undefined) {
            options.headers['x-xsrf-token'] = cookies['XSRF-TOKEN'];
        }
    }, response: (resp, options, ctx) => {
        const cookies = cookie.parse(options.jar.getCookieString(options.baseUrl));
        if (cookies['keystone.uid'] !== undefined && cookies['this.sid'] !== undefined) {
            // The following path is used by the restfuzz command of test-keystone.py 
            fs.writeFileSync(path.join(options.storeLocation, 'keystone_auth_cookie.txt'),
                `this.sid=${cookies['this.sid']}; ` +
                `keystone.uid=${cookies['keystone.uid']};`);
        }
    }
}