import { GymsRepository } from '@/repositories/gyms-repository-interface'
import { Gym } from '@prisma/client'

interface FetchGymsNearbyRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchGymsNearbyResponse {
  gyms: Gym[]
}

export class FetchGymsNearbyUseCase {
  private gymRepository

  constructor(gymRepository: GymsRepository) {
    this.gymRepository = gymRepository
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchGymsNearbyRequest): Promise<FetchGymsNearbyResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      userLatitude,
      userLongitude,
    })

    return { gyms }
  }
}
