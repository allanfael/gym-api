import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { ROUTES } from '@/utils/enums/routes'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

const gym = {
  title: 'My Gym',
  subtitle: 'My Gym',
  phone: '991211221',
  latitude: -25.3785927,
  longitude: -49.1945984,
}

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    expect(response.statusCode).toEqual(201)
  })
})
