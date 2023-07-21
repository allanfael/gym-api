import { Prisma } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'

import { FetchGymsNearbyUseCase } from './fetch-nearby-gyms'

const data: Prisma.GymUncheckedCreateInput = {
  title: 'Gym Doe',
  subtitle: 'My Gym',
  phone: '9991312133',
  latitude: -25.3785927,
  longitude: -49.1945984,
}

const farLatitude = -25.5309282
const farLongitude = -48.8956082

let gymRepository: InMemoryGymsRepositories
let sut: FetchGymsNearbyUseCase

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepositories()
    sut = new FetchGymsNearbyUseCase(gymRepository)
  })

  it('should be able to find gyms nearby', async () => {
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
      userLatitude: Number(data.latitude),
      userLongitude: Number(data.longitude),
    })

    expect(gyms).toHaveLength(2)
  })

  it('should not be able to find far gyms', async () => {
    for (let i = 1; i <= 2; i++) {
      await gymRepository.create({
        title: data.title,
        subtitle: `${data.subtitle}-${i}`,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
      })
    }

    await gymRepository.create({
      title: 'Far Gym',
      subtitle: `${data.subtitle}-3`,
      phone: data.phone,
      latitude: farLatitude,
      longitude: farLongitude,
    })

    const { gyms } = await sut.execute({
      userLatitude: Number(data.latitude),
      userLongitude: Number(data.longitude),
    })

    expect(gyms).not.toEqual(expect.objectContaining({ title: 'Far Gym' }))
  })
})
