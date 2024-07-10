const fs = require('fs')
const https = require('https')

const req = https.request(
  {
    hostname: 'www-chs-upgrade.ruraldev.org.uk',
    port: 443,
    path: '/extapi/organisation/5565448',
    method: 'GET',
    cert: fs.readFileSync('client.crt'),
    key: fs.readFileSync('client.key'),
    headers: {
      email: 'Test.User12@rpa.gov.uk',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
  },
  res => {
    const data = []
    console.log(res.statusCode, res.statusMessage)
    res
      .on('data', function (chunk) {
        data.push(chunk)
      })
      .on('end', function () {
        const buffer = Buffer.concat(data)
        console.log(buffer.toString())
      })
  }
)

req.on('error', e => console.error(e.message))

req.end()
