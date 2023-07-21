import { FastifyInstance } from 'fastify'

import { ROUTES } from '@/utils/enums/routes'

import { verifyJWT } from '../../middlewares/jtw-verify'
import { authenticate, profile, refresh, register } from '.'

const tokenVerify = [verifyJWT]

export const usersRoutes = async (app: FastifyInstance) => {
  app.post(ROUTES.REGISTER, register)
  app.post(ROUTES.AUTHENTICATE, authenticate)
  app.patch(ROUTES.REFRESH_TOKEN, refresh)

  // Authenticated
  app.get(
    ROUTES.PROFILE,
    {
      onRequest: tokenVerify,
    },
    profile,
  )
}
