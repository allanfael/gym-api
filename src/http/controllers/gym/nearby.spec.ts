import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { ROUTES } from '@/utils/enums/routes'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

const nearbyGym = {
  title: 'Nearby Gym',
  subtitle: 'My Gym',
  phone: '991211221',
  latitude: -25.3785927,
  longitude: -49.1945984,
}

const farGym = {
  title: 'Far Gym',
  subtitle: 'My Gym',
  phone: '991211221',
  latitude: -25.5309282,
  longitude: -48.8956082,
}

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find nearby gyms', async () => {
    const admin = await createAndAuthenticateUser(app, true)
    const member = await createAndAuthenticateUser(app)

    await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(nearbyGym)

    await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(farGym)

    const response = await request(app.server)
      .get(ROUTES.GYMS_NEARBY)
      .set('Authorization', `Bearer ${member.token}`)
      .query({
        latitude: -25.3785927,
        longitude: -49.1945984,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: nearbyGym.title,
      }),
    ])
    expect(response.body.gyms).toHaveLength(1)
  })
})
