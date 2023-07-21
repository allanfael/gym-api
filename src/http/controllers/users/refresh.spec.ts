import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { ROUTES } from '@/utils/enums/routes'

describe('Refresh (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post(ROUTES.REGISTER).send({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123123',
    })

    const loginResponse = await request(app.server)
      .post(ROUTES.AUTHENTICATE)
      .send({
        email: 'john@email.com',
        password: '123123',
      })

    const cookie = loginResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch(ROUTES.REFRESH_TOKEN)
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
