import { FastifyCorsOptions } from '@fastify/cors'
import { FastifyRequest } from 'fastify'

export function corsConfig() {
  return (req: FastifyRequest, callback: any) => {
    const productionURL = ['*']

    let corsOptions: FastifyCorsOptions

    const hostname = req.headers.host || ''
    const isLocalHost = /^localhost/m.test(hostname)

    // do not include CORS headers for requests from localhost
    if (isLocalHost) {
      corsOptions = {
        origin: false,
      }
      return callback(null, corsOptions)
    }

    corsOptions = {
      origin: [productionURL],
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    }

    callback(null, corsOptions)
  }
}
