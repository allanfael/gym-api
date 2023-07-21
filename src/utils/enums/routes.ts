export enum ROUTES {
  AUTHENTICATE = '/sessions',
  REGISTER = '/users',
  PROFILE = '/me',
  REFRESH_TOKEN = '/token/refresh',
  // Gym
  GYMS = '/gyms',
  GYMS_SEARCH = '/gyms/search',
  GYMS_NEARBY = '/gyms/nearby',
  // CheckIn
  CHECK_IN = `${GYMS}/:gymId/check-ins`,
  CHECK_IN_HISTORY = '/check-ins/history',
  CHECK_IN_METRICS = '/check-ins/metrics',
  CHECK_IN_VALIDATE = '/check-ins/:checkInId/validate',
}
