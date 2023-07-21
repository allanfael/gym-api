import { GymsRepository } from '@/repositories/gyms-repository-interface'
import { Gym, Prisma } from '@prisma/client'

interface CreateGymResponse {
  gym: Gym
}

export class CreateGymUseCase {
  private gymRepository: GymsRepository

  constructor(gymRepository: GymsRepository) {
    this.gymRepository = gymRepository
  }

  async execute(
    data: Prisma.GymUncheckedCreateInput,
  ): Promise<CreateGymResponse> {
    const gym = await this.gymRepository.create(data)

    return { gym }
  }
}
