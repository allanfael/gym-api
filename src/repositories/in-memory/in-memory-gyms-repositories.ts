import { Prisma, Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository-interface'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinate'

export interface FindManyNearbyParams {
  userLatitude: number
  userLongitude: number
}

export class InMemoryGymsRepositories implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      subtitle: data.subtitle ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items.filter((item) => item.title.includes(query))
    const firstTwentyGyms = gyms?.slice((page - 1) * 20, page * 20)

    if (!gyms) return []

    return firstTwentyGyms
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinate(
        {
          latitude: params.userLatitude,
          longitude: params.userLongitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance <= 10
    })

    if (!gyms) return []

    return gyms
  }
}
