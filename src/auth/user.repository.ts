import { EntityRepository, Repository } from 'typeorm'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        const user = this.create()
        user.username = username
        user.salt = await this.getSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') {
                // duplicate username
                throw new ConflictException('Username already exits.')
            } else {
                console.error(e)
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })

        if (user) {
            return await user.validatePassword(password)
        }
        return false
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    }

    async getSalt(): Promise<string> {
        return await bcrypt.genSalt()
    }
}
