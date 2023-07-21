import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repositories'
import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'

const password = '123456'
const email = 'john@email.com'

let userRepository: InMemoryUsersRepositories
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepositories()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const response = await sut.execute({
      name: 'John',
      email,
      password,
    })

    expect(response).toBeDefined()
  })

  it('should hash password', async () => {
    const { user } = await sut.execute({
      name: 'John',
      email,
      password,
    })

    const isPasswordHashed = await compare(password, user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not to able to register user with same email twice', async () => {
    await sut.execute({
      name: 'John',
      email,
      password,
    })

    expect(async () => {
      await sut.execute({
        name: 'John',
        email,
        password,
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.USER_ALREADY_EXISTS)
  })
})
