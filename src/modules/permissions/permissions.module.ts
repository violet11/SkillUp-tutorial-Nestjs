import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { Permission } from 'entities/permission.entity'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from './guards/permission.guard'
import { AuthService } from 'modules/auth/auth.service'

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
