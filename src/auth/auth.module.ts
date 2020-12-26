import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserRepository } from './user.repository'
import { JwtStrategy } from './jwt.strategy'
import * as config from 'config'

const authConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || authConfig.secret,
      signOptions: {
        expiresIn: authConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([
      UserRepository
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule {}