import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { ROUTES } from '@/utils/enums/routes'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post(ROUTES.REGISTER).send({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123123',
    })

    const response = await request(app.server).post(ROUTES.AUTHENTICATE).send({
      email: 'john@email.com',
      password: '123123',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
