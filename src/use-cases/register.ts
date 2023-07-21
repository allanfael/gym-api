import { ApiError } from '@/helpers/api-error-handler'
import { UsersRepository } from '@/repositories/users-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  private userRepository: UsersRepository

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail)
      throw new ApiError(
        API_ERRORS_MESSAGE.USER_ALREADY_EXISTS,
        API_ERROS_STATUS_CODE.CONFLICT,
      )

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
