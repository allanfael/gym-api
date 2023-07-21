import { FastifyInstance } from 'fastify'

import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { ROUTES } from '@/utils/enums/routes'

import { verifyJWT } from '../../middlewares/jtw-verify'
import { create, history, metrics, validate } from '.'

export const checkInRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post(ROUTES.CHECK_IN, { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.get(ROUTES.CHECK_IN_HISTORY, history)
  app.get(ROUTES.CHECK_IN_METRICS, metrics)
  app.patch(ROUTES.CHECK_IN_VALIDATE, validate)
}
