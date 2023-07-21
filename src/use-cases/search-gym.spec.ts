import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { describe, expect, it, beforeEach } from 'vitest'
import { SearchGymUseCase } from './search-gym'
import { Prisma } from '@prisma/client'

const data: Prisma.GymUncheckedCreateInput = {
  title: 'Gym Doe',
  subtitle: 'My Gym',
  phone: '9991312133',
  latitude: -25.3785927,
  longitude: -49.1945984,
}

let gymRepository: InMemoryGymsRepositories
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepositories()
    sut = new SearchGymUseCase(gymRepository)
  })

  it('should be able to find any gym by title', async () => {
    for (let i = 1; i <= 2; i++) {
      await gymRepository.create({
        title: data.title,
        subtitle: `${data.subtitle}-${i}`,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
      })
    }

    const { gyms } = await sut.execute({
      query: data.title,
      page: 1,
    })

    expect(gyms).toHaveLength(2)
  })

  it('should be able to search by pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: data.title,
        subtitle: `${data.subtitle}-${i}`,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
      })
    }

    const { gyms } = await sut.execute({
      query: data.title,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
  })
})
