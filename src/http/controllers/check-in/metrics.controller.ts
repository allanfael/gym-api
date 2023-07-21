import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.sub

  const useCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await useCase.execute({ userId })

  return reply.status(200).send({
    checkInsCount,
  })
}
