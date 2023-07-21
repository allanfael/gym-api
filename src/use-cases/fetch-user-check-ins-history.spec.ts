import { expect, describe, beforeEach, it } from 'vitest'
import { InMemoryCheckInRepositories } from '../repositories/in-memory/in-memory-checkins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

const gym_id = 'gym-id'
const user_id = 'user-id'

let checkInRepository: InMemoryCheckInRepositories
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch user Check Ins Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepositories()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    await checkInRepository.create({
      user_id,
      gym_id,
    })

    await checkInRepository.create({
      user_id,
      gym_id: 'gym-id-2',
    })

    const { checkIns } = await sut.execute({
      userId: user_id,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
  })

  it('should be able to fetch paginated check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id,
        gym_id: `${gym_id}-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: user_id,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
  })
})
