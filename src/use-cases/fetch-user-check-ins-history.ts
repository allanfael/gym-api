import { ApiError } from '@/helpers/api-error-handler'
import { CheckInsRepository } from '@/repositories/check-ins-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  private checkInRepository: CheckInsRepository

  constructor(checkInRepository: CheckInsRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
