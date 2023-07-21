import { GymsRepository } from '@/repositories/gyms-repository-interface'
import { Gym } from '@prisma/client'

interface SearchGymRequest {
  query: string
  page: number
}

interface SearchGymResponse {
  gyms: Gym[]
}

export class SearchGymUseCase {
  private gymRepository

  constructor(gymRepository: GymsRepository) {
    this.gymRepository = gymRepository
  }

  async execute({ query, page }: SearchGymRequest): Promise<SearchGymResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return { gyms }
  }
}
