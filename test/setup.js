import 'dotenv/config.js'
import server from '../mocks/server.js'

global.mockServer = server

export default async () => {
  const url = await server.start()
  console.log(`Mock server running ${url}`)
}
