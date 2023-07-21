import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { ApiError } from '@/helpers/api-error-handler'
import { UsersRepository } from '@/repositories/users-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  private userRepository: UsersRepository

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user)
      throw new ApiError(
        API_ERRORS_MESSAGE.AUTHENTICATE,
        API_ERROS_STATUS_CODE.UNAUTHORIZED,
      )

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches)
      throw new ApiError(
        API_ERRORS_MESSAGE.AUTHENTICATE,
        API_ERROS_STATUS_CODE.UNAUTHORIZED,
      )

    return { user }
  }
}
