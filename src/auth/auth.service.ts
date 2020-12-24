import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { JwtPayload } from './types/jwt-payload-interface'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        return await this.userRepository.signUp(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) : Promise<{ accessToken: string }> {
        const user = await this.userRepository.validateUserPassword(authCredentialsDto)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials!')
        }

        const payload: JwtPayload = { username: authCredentialsDto.username }
        const accessToken = await this.jwtService.sign(payload)

        return {
            accessToken
        }
    }
}
