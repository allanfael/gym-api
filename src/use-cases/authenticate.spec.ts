import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repositories'
import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'

import { AuthenticateUseCase } from './authenticate'

const password = '123456'
const email = 'john@email.com'

let userRepository: InMemoryUsersRepositories
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepositories()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(async () => {
      await sut.execute({
        email,
        password,
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.AUTHENTICATE)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepositories()

    await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6),
    })

    expect(async () => {
      await sut.execute({
        email,
        password: '123321',
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.AUTHENTICATE)
  })
})
