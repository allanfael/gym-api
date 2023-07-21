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

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gym by title', async () => {
    const admin = await createAndAuthenticateUser(app, true)
    const member = await createAndAuthenticateUser(app)

    await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(gym)

    const response = await request(app.server)
      .get(ROUTES.GYMS_SEARCH)
      .set('Authorization', `Bearer ${member.token}`)
      .query({
        query: gym.title,
      })

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: gym.title,
      }),
    ])
    expect(response.body.gyms).toHaveLength(1)
  })
})
