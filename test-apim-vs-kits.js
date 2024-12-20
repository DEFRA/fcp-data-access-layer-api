import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import winston from 'winston';
import { RuralPayments } from './app/data-sources/rural-payments/RuralPayments.js';

const logger = winston.createLogger({
  level: 'emerg',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const endpoints = [
  'lms/organisation/5613879/geometries?bbox=0,0,0,0&historicDate=141119',
  'lms/organisation/5613879/parcels/historic/19-Jul-21',
  'organisation/5625145',
  'person/5043447/summary'
]
const envs = ['tst', 'dev', 'kits']

;(async () => {
  const results = []
  for (const env of envs) {
    dotenv.config({ path: `.env.${env}`, override: true })
    
    let token
    if (process.env.RP_INTERNAL_APIM_ACCESS_TOKEN_URL) {
      const ruralPayments = new RuralPayments({ logger })
      await ruralPayments.getApimAccessToken()
      token = ruralPayments.apimAccessToken
    }

    for (const endpoint of endpoints) {
      console.log('\nTesting: ', `(${env}) ${process.env.RP_INTERNAL_APIM_URL}${endpoint}`)
      const stime = performance.now()
      const datetime = new Date()
      let response
      let responseText

      let data = []
      const url = new URL(process.env.RP_INTERNAL_APIM_URL)
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + endpoint,
        method: 'GET',
        headers: {
          email: process.env.RURAL_PAYMENTS_PORTAL_EMAIL,
          'Accept-Encoding': 'gzip, deflate, br',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          CacheControl: 'no-cache'
        }
      }
      if (process.env.CERT_PATH) {
        options.cert = fs.readFileSync(process.env.CERT_PATH)
      }
      if (process.env.KEY_PATH) {
        options.key = fs.readFileSync(process.env.KEY_PATH)
      }
      if (token) {
        options.headers.Authorization = `Bearer ${token}`
      }
      if (process.env.RP_INTERNAL_APIM_SUBSCRIPTION_KEY) {
        options.headers['Ocp-Apim-Subscription-Key'] = process.env.RP_INTERNAL_APIM_SUBSCRIPTION_KEY
      }
      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          response = res

          res
            .on('data', function (chunk) {
              data.push(chunk)
            })
            .on('end', function () {
              const buffer = Buffer.concat(data)
              responseText = buffer.toString()
              resolve()
            })
        })
        req.on('error', reject)
        req.end()
      })

      const ftime = performance.now()
      const elapsed_time = Math.round(ftime - stime)

      console.log('Test complete, status: ', response.status || response.statusCode)
      results.push({
        datetime: datetime.toISOString(),
        env,
        endpoint,
        response_status: response.status || response.statusCode,
        response_duration: elapsed_time,
        response_size: Buffer.byteLength(responseText)
      })
    }
  }

  const rawData = results.reduce((acc, result) => {
      acc += Object.values(result).join(',') + '\n'
      return acc;
    },
    Object.keys(results[0]).join(',') + '\n'
  );
  fs.writeFileSync('test-apim-vs-kits.csv', rawData, 'utf8')

  const rawDataGrouped = results.reduce((acc, result) => {
    acc[result.endpoint] = acc[result.endpoint] || []
    acc[result.endpoint].push(result)
    return acc
  }, {})
  const chartData = Object.values(rawDataGrouped).reduce((acc, group) => {
    const response_durations = group.map(result => result.response_duration)
    acc += group[0].endpoint + ',' + response_durations.join(',') + '\n'
    return acc;
  }, 'endpoint,' + Object.values(rawDataGrouped)[0].map(result => result.env).join(',') + '\n')

  fs.writeFileSync('test-apim-vs-kits-charts.csv', chartData, 'utf8')

  console.log(`\n\nComplete`)
  console.table(results)
  console.log(`\nRaw data: test-apim-vs-kits.csv`)
  console.log(`\nChart data: test-apim-vs-kits-charts.csv`)
})()
