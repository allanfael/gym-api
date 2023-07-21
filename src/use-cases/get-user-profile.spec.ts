import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repositories'
import { hash } from 'bcryptjs'
import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'

const password = '123456'
const email = 'john@email.com'

let userRepository: InMemoryUsersRepositories
let sut: GetUserProfileUseCase

describe('Get User Profile UseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepositories()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const response = await userRepository.create({
      name: 'John',
      email,
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      userId: response.id,
    })

    expect(user.name).toEqual('John')
  })

  it('should not be able to get user profile', async () => {
    expect(async () => {
      await sut.execute({
        userId: '1',
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.RESOURCE_NOT_FOUND)
  })
})
