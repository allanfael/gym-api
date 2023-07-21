import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchSchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const data = searchSchema.parse(request.query)

  const search = makeSearchGymsUseCase()

  const { gyms } = await search.execute(data)

  return reply.status(200).send({
    gyms,
  })
}
