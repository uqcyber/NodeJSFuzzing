// Copyright (c) 2019, 2021, Oracle and/or its affiliates.

const fs = require('fs');
const path = require('path');
const os = require('os');
const cookie = require('cookie');

module.exports = {
    response: (resp, options, ctx) => {
        const cookies = cookie.parse(options.jar.getCookieString(options.baseUrl));
        if(cookies['mongo-express'] !== undefined) {
            // The following path is used by the restfuzz command of test-mongo-express.py 
            fs.writeFileSync(path.join(options.storeLocation, 'me_auth_cookie.txt'),
                             `mongo-express=${cookies['mongo-express']};`);
        }
    }
}