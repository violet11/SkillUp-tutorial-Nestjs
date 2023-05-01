import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import Logging from 'library/Logging'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const access_token: string = request.cookies['access_token']
    try {
      if (!access_token || !!!this.jwtService.verify(access_token)) {
        // return Forbidden error
        return false
      }
      return super.canActivate(context)
    } catch (error) {
      Logging.error(error)
      throw new ForbiddenException()
    }
  }
}
