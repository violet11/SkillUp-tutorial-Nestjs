import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RequestWithUser } from 'interfaces/auth.interface'
import { RolesService } from 'modules/roles/roles.service'
import { UsersService } from 'modules/users/users.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UsersService, private roleService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('test')
    const request = context.switchToHttp().getRequest() as RequestWithUser
    const access: string = this.reflector.get('access', context.getHandler())

    if (!access) {
      return true
    }

    const user = await this.userService.findById(request.user.id, ['role'])
    if (!user.role) {
      throw new ForbiddenException()
    }
    const role = await this.roleService.findById(user.role.id, ['permissions'])
    /**
     * EXAMPLE:
     * Permissions:
     * view_users
     * add_users
     * edit_users
     * delete_users
     *
     * view_roles
     * add_roles
     * edit_roles
     * delete_roles
     *
     * view_permissions
     * add_permissions
     * edit_permissions
     * delete_permissions
     */
    if (request.method === 'GET') {
      return role.permissions.some(
        (p) =>
          p.name === `view_${access}` ||
          p.name === `edit_${access}` ||
          p.name === `add_${access}` ||
          p.name === `delete_${access}`,
      )
    } else if (request.method === 'POST') {
      return role.permissions.some((p) => p.name === `add_${access}`)
    } else if (request.method === 'PATCH' || request.method === 'PUT') {
      return role.permissions.some((p) => p.name === `edit_${access}`)
    } else if (request.method === 'DELETE') {
      return role.permissions.some((p) => p.name === `delete_${access}`)
    }
    throw new ForbiddenException()
  }
}
