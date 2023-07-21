import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymSchema = z.object({
    title: z.string(),
    subtitle: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const data = createGymSchema.parse(request.body)

  const createGym = makeCreateGymUseCase()

  const { gym } = await createGym.execute(data)

  return reply.status(201).send({
    gym,
  })
}
