import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const query = checkInHistoryQuerySchema.parse(request.query)

  const data = {
    ...query,
    userId: request.user.sub,
  }

  const useCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await useCase.execute(data)

  return reply.status(200).send({
    checkIns,
  })
}
