import { CheckIn } from '@prisma/client'

import { ApiError } from '@/helpers/api-error-handler'
import { CheckInsRepository } from '@/repositories/check-ins-repository-interface'
import { GymsRepository } from '@/repositories/gyms-repository-interface'
import {
  API_ERRORS_MESSAGE,
  API_ERROS_STATUS_CODE,
} from '@/utils/enums/api-erros.enum'
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinate'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE_IN_KILOMETERS = 0.1

export class CheckInUseCase {
  private checkInRepository: CheckInsRepository
  private gymsRepository: GymsRepository

  constructor(
    checkInRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInRepository = checkInRepository
    this.gymsRepository = gymsRepository
  }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym)
      throw new ApiError(
        API_ERRORS_MESSAGE.RESOURCE_NOT_FOUND,
        API_ERROS_STATUS_CODE.NOT_FOUND,
      )

    const distance = getDistanceBetweenCoordinate(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distance > MAX_DISTANCE_IN_KILOMETERS)
      throw new ApiError(
        API_ERRORS_MESSAGE.MAX_DISTANCE_REACHED,
        API_ERROS_STATUS_CODE.FORBIDDEN,
      )

    const checkInOnSameDay = await this.checkInRepository.findCheckInOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay)
      throw new ApiError(
        API_ERRORS_MESSAGE.NUMBER_MAX_OF_CHECK_INS_REACHED,
        API_ERROS_STATUS_CODE.FORBIDDEN,
      )

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
