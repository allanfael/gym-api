import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeValidadeCheckInUseCase } from '@/use-cases/factories/make-validade-check-in-use-case'

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const useCase = makeValidadeCheckInUseCase()

  await useCase.execute({ checkInId })

  return reply.status(204)
}
