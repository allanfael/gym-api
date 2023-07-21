import { ApiError } from '@/helpers/api-error-handler'
import { CheckInsRepository } from '@/repositories/check-ins-repository-interface'
import { GymsRepository } from '@/repositories/gyms-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinate'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

interface ValidadeCheckInUseCaseRequest {
  checkInId: string
}

interface ValidadeCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidadeCheckInUseCase {
  private checkInRepository: CheckInsRepository

  constructor(checkInRepository: CheckInsRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    checkInId,
  }: ValidadeCheckInUseCaseRequest): Promise<ValidadeCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn)
      throw new ApiError(
        API_ERRORS_MESSAGE.RESOURCE_NOT_FOUND,
        API_ERROS_STATUS_CODE.NOT_FOUND,
      )

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new ApiError(
        API_ERRORS_MESSAGE.MAX_TOLERANCE_TO_VALIDATE_CHECK_IN_REACHED,
        API_ERROS_STATUS_CODE.FORBIDDEN,
      )

    checkIn.validated_at = new Date()

    await this.checkInRepository.save(checkIn)

    return { checkIn }
  }
}
