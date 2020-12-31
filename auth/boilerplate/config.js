const fs = require('fs');
const path = require('path');
const os = require('os');
const cookie = require('cookie');module.exports = {
    headers: (req, options, ctx) => {
        const cookies = cookie.parse(options.jar.getCookieString(options.baseUrl));
        if(cookies['apostrophe-boilerplate.csrf'] !== undefined && cookies['apostrophe-boilerplate.sid'] !== undefined) {            // The following path is used by the restfuzz command of test-apostrophe.py 
            fs.writeFileSync(path.join(os.tmpdir(), 'apostrophe_auth_cookie.txt'),
                             `apostrophe-boilerplate.sid=${cookies['apostrophe-boilerplate.sid']}; ` +
                             `apostrophe-boilerplate.csrf=${cookies['apostrophe-boilerplate.csrf']}`);            // The following path is used by the restfuzz command of test-apostrophe.py 
            fs.writeFileSync(path.join(os.tmpdir(), 'apostrophe_auth_header.txt'),
                             `${cookies['apostrophe-boilerplate.csrf']}`);
        }
    }
}