import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/lib/prisma'
import { ROUTES } from '@/utils/enums/routes'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: isAdmin ? 'john@email.com' : 'doe@email.com',
      password_hash: await hash('123123', 6),
      rule: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const loginResponse = await request(app.server)
    .post(ROUTES.AUTHENTICATE)
    .send({
      email: 'john@email.com',
      password: '123123',
    })

  const { token } = loginResponse.body

  return { token }
}
