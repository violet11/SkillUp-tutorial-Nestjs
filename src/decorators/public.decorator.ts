import { SetMetadata } from '@nestjs/common'
// With this decorator we will let all users have access to path
export const Public = () => SetMetadata('isPublic', true)
