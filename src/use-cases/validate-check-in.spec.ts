import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { API_ERRORS_MESSAGE } from '@/utils/enums/api-erros.enum'

import { InMemoryCheckInRepositories } from '../repositories/in-memory/in-memory-checkins-repository'
import { ValidadeCheckInUseCase } from './validate-check-in'

let checkInRepository: InMemoryCheckInRepositories
let sut: ValidadeCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepositories()
    sut = new ValidadeCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able validate check in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able validate inexistent check in', async () => {
    await expect(async () => {
      await sut.execute({
        checkInId: 'inexistent',
      })
    }).rejects.toThrow(API_ERRORS_MESSAGE.RESOURCE_NOT_FOUND)
  })

  it('should not be able validate check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const twentyOneMinutes = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutes)

    await expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toThrow(
      API_ERRORS_MESSAGE.MAX_TOLERANCE_TO_VALIDATE_CHECK_IN_REACHED,
    )
  })
})
