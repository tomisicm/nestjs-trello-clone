import { Body, UseGuards, Controller, ValidationPipe, Request, Post, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        try {
            return await this.authService.signUp(authCredentialsDto)
        } catch (e) {
            console.error(e)
        }
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return await this.authService.signIn(authCredentialsDto)
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    async getLoggedInUser(@Request() request) {
        return request.user
    }

    @Get('/test')
    @UseGuards(AuthGuard())
    async getTest(@Request() request) {
        return 'test successfull'
    }
}
