import { FastifyInstance } from 'fastify'

import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { ROUTES } from '@/utils/enums/routes'

import { verifyJWT } from '../../middlewares/jtw-verify'
import { create, nearby, search } from '.'

export const gymRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post(ROUTES.GYMS, { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.get(ROUTES.GYMS_SEARCH, search)
  app.get(ROUTES.GYMS_NEARBY, nearby)
}
