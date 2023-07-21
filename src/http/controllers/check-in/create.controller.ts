import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    userLatitude: z.number().refine((value) => Math.abs(value) <= 90),
    userLongitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const params = createCheckInParamsSchema.parse(request.params)
  const body = createCheckInBodySchema.parse(request.body)

  const data = {
    userId: request.user.sub,
    ...params,
    ...body,
  }

  const useCase = makeCheckInUseCase()

  const { checkIn } = await useCase.execute(data)

  return reply.status(201).send({
    checkIn,
  })
}
