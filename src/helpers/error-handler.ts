import { FastifyReply, FastifyRequest } from 'fastify'

import { env } from '@/env'
import { ApiError } from '@/helpers/api-error-handler'

export const errorHandler = (
  error: Error & Partial<ApiError>,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const statusCode = error.statusCode ?? 500
  const message = error.statusCode ? error.message : 'Internal Server Error'

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: implements tools to get logs
  }

  return reply.status(statusCode).send({ message })
}
