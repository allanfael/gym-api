import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

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

describe('Check-ins Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    vi.useFakeTimers()
  })

  afterAll(async () => {
    await app.close()
    vi.useRealTimers()
  })

  it('should be able to get the count of check-ins', async () => {
    const admin = await createAndAuthenticateUser(app, true)
    const member = await createAndAuthenticateUser(app)

    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    const createdGym = await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(gym)

    await request(app.server)
      .post(`/gyms/${createdGym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${member.token}`)
      .send({
        userLatitude: -25.3785927,
        userLongitude: -49.1945984,
      })

    vi.setSystemTime(new Date(2023, 0, 21, 9, 0, 0))

    await request(app.server)
      .post(`/gyms/${createdGym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${member.token}`)
      .send({
        userLatitude: -25.3785927,
        userLongitude: -49.1945984,
      })

    const response = await request(app.server)
      .get(ROUTES.CHECK_IN_METRICS)
      .set('Authorization', `Bearer ${member.token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
