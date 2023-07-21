import { expect, describe, beforeEach, it } from 'vitest'
import { InMemoryCheckInRepositories } from '../repositories/in-memory/in-memory-checkins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

const gym_id = 'gym-id'
const user_id = 'user-id'

let checkInRepository: InMemoryCheckInRepositories
let sut: GetUserMetricsUseCase

describe('Get user Check Ins Metrics Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepositories()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should return 0 checkIns', async () => {
    const checkInsCount = await checkInRepository.countByUserId(user_id)

    expect(checkInsCount).toBe(0)
  })

  it('should be able to fetch paginated check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id,
        gym_id: `${gym_id}-${i}`,
      })
    }

    const { checkInsCount } = await sut.execute({
      userId: user_id,
    })

    expect(checkInsCount).toBe(22)
  })
})
