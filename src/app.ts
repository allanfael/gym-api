import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { corsConfig } from './config/cors'
import { jwtConfig } from './config/jwt'
import { errorHandler } from './helpers/error-handler'
import { checkInRoutes } from './http/controllers/check-in/routes'
import { gymRoutes } from './http/controllers/gym/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(cors, corsConfig)

app.register(fastifyJwt, jwtConfig)

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issue: error.format(),
    })
  }
  return errorHandler(error, request, reply)
})
