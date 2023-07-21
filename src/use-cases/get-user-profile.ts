import { User } from '@prisma/client'

import { ApiError } from '@/helpers/api-error-handler'
import { UsersRepository } from '@/repositories/users-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  private userRepository: UsersRepository

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository
  }

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user)
      throw new ApiError(
        API_ERRORS_MESSAGE.RESOURCE_NOT_FOUND,
        API_ERROS_STATUS_CODE.NOT_FOUND,
      )

    return { user }
  }
}
