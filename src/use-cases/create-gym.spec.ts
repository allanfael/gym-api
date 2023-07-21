import { expect, describe, it, beforeEach } from 'vitest'
import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { Prisma } from '@prisma/client'

const data: Prisma.GymUncheckedCreateInput = {
  title: 'Gym Doe',
  subtitle: 'My Gym',
  phone: '9991312133',
  latitude: -25.3785927,
  longitude: -49.1945984,
}

let gymRepository: InMemoryGymsRepositories
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepositories()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute(data)

    expect(gym.id).toEqual(expect.any(String))
  })
})
