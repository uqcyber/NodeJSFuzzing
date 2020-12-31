const headers = {
    Host: 'localhost:4000',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'content-type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,fr-CA;q=0.7,fr;q=0.6'
};module.exports = [
    {"meta":{"req":{"url":"/login","headers":headers,"method":"POST","query":{},"body":"userName=user1&password=User1_123&_csrf="}}}
]