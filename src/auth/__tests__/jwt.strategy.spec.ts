import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtStrategy } from '../jwt.strategy'
import { JwtPayload } from '../types/jwt-payload-interface'
import { User } from '../user.entity'
import { UserRepository } from '../user.repository'

const mockUserRepository = () => ({
    findOne: jest.fn()
})

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy
    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: UserRepository,
                    useFactory: mockUserRepository
                }
            ]
        }).compile()

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
        userRepository = await module.get<UserRepository>(UserRepository)
    })

    it('User is validated successfully', async () => {
        const user = new User()
        user.username = 'TestUser'
        const payload: JwtPayload = {
            username: 'TestUser'
        }
        userRepository.findOne.mockResolvedValue(user)

        expect(userRepository.findOne).not.toBeCalled()
        const result = await jwtStrategy.validate(payload)
        expect(userRepository.findOne).toBeCalledWith({ username: payload.username })
        expect(result).toEqual(user)
    })

    it('User credentials are invalid', async () => {
        const payload: JwtPayload = {
            username: 'TestUser'
        }
        userRepository.findOne.mockResolvedValue(null)

        expect(userRepository.findOne).not.toBeCalled()
        await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException)
        expect(userRepository.findOne).toBeCalledWith({ username: 'TestUser' })
    })
})
