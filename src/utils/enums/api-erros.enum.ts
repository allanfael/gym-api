export enum API_ERRORS_MESSAGE {
  USER_ALREADY_EXISTS = 'E-mail já em uso',
  AUTHENTICATE = 'Usuário ou senha incorreto',
  RESOURCE_NOT_FOUND = 'Recurso não encontrado',
  MAX_DISTANCE_REACHED = 'Distância máxima alcançada',
  NUMBER_MAX_OF_CHECK_INS_REACHED = 'Número máximo de check-ins alcançado',
  MAX_TOLERANCE_TO_VALIDATE_CHECK_IN_REACHED = 'Tolerância para validar check-in alcançada',
}

export enum API_ERROS_STATUS_CODE {
  CONFLICT = 409,
  UNAUTHORIZED = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
}
