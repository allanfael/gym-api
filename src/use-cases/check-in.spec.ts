import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repositories'
import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'

import { InMemoryCheckInRepositories } from '../repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'

const gym_id = 'gym-id'
const user_id = 'user-id'
const latitude = -25.3785927
const longitude = -49.1945984
const farLatitude = -25.3585061
const farLongitude = -49.1571762

let checkInRepository: InMemoryCheckInRepositories
let gymsRepository: InMemoryGymsRepositories
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepositories()
    gymsRepository = new InMemoryGymsRepositories()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.items.push({
      id: gym_id,
      title: 'a',
      subtitle: 'a',
      phone: '',
      latitude: new Decimal(latitude),
      longitude: new Decimal(longitude),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: gym_id,
      userId: user_id,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    await sut.execute({
      gymId: gym_id,
      userId: user_id,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    await expect(async () => {
      await sut.execute({
        gymId: gym_id,
        userId: user_id,
        userLatitude: latitude,
        userLongitude: longitude,
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.NUMBER_MAX_OF_CHECK_INS_REACHED)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    await sut.execute({
      gymId: gym_id,
      userId: user_id,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: gym_id,
      userId: user_id,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not able to check in on distance gym', async () => {
    const id = '2'

    gymsRepository.items.push({
      id,
      title: 'a',
      subtitle: 'a',
      phone: '',
      longitude: new Decimal(farLatitude),
      latitude: new Decimal(farLongitude),
    })

    await expect(async () => {
      await sut.execute({
        gymId: id,
        userId: user_id,
        userLatitude: latitude,
        userLongitude: longitude,
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.MAX_DISTANCE_REACHED)
  })
})
