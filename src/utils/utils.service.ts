import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import Logging from 'library/Logging'
import { JwtType, TokenPayload } from 'interfaces/auth.interface'

@Injectable()
export class UtilsService {
  /**
   * @constructor
   */
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  /**
   * Hash string value with bcrypt.
   *
   * @param {string} value
   * @param {number} salt optional (Default: 10)
   *
   * @author Nejc <nejcrogelsek0@gmail.com>
   */
  public async hash(value: string, salt = 10): Promise<string> {
    try {
      const generatedSalt = await bcrypt.genSalt(salt)
      return bcrypt.hash(value, generatedSalt)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while hashing password.')
    }
  }

  /**
   * Compare hashes with bcrypt and returns `true` if hashes matches.
   *
   * @param {string | Buffer} value
   * @param {string} salt
   *
   * @author Nejc <nejcrogelsek0@gmail.com>
   */
  public async compareHash(value: string | Buffer, encryptedValue: string): Promise<boolean> {
    try {
      return bcrypt.compare(value, encryptedValue)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while comparing hash.')
    }
  }

  /**
   * Generate JWT token based on {@link JwtType}
   *
   * @param {string} userId
   * @param {string} email
   * @param {JwtType} type
   * @param {{ [key: string]: unknown }} options optional
   *
   * @author Nejc <nejcrogelsek0@gmail.com>
   */
  public async generateToken(
    userId: string,
    email: string,
    type: JwtType,
    options?: { [key: string]: unknown },
  ): Promise<string> {
    try {
      const payload: TokenPayload = {
        sub: userId,
        name: email,
        type,
        ...options,
      }
      let token: string
      switch (type) {
        case 'ACCESS_TOKEN':
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_SECRET_EXPIRES'),
          })
          break
        default:
          throw new BadRequestException('Permission denied.')
      }
      return token
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while generating a new token.')
    }
  }

  /**
   * Verifies httpOnly cookie.
   *
   * @param {string} cookie
   *
   * @author Nejc <nejcrogelsek0@gmail.com>
   */
  public verifyCookie(cookie: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verifyAsync(cookie)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while verifying httpOnly cookie.')
    }
  }
}
