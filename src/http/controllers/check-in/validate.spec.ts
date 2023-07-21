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

describe('Validade Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validade a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    const createdGym = await request(app.server)
      .post(ROUTES.GYMS)
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    const createdCheckIn = await request(app.server)
      .post(`/gyms/${createdGym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -25.3785927,
        userLongitude: -49.1945984,
      })

    const { id } = createdCheckIn.body.checkIn

    setTimeout(async () => {
      const response = await request(app.server)
        .patch(`/check-ins/${id}/validate`)
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(response.statusCode).toEqual(204)
    }, 100)
  })
})
