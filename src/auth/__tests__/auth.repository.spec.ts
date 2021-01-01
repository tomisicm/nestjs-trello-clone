import { Test } from '@nestjs/testing'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserRepository } from '../user.repository'
import { AuthCredentialsDto } from '../dto/auth-credentials.dto'
import { User } from '../user.entity'

const mockCredentialsDto: AuthCredentialsDto = {
    username: 'TestUser',
    password: 'qqqqqqqq'
}

describe('UserRepository', () => {
    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile()

        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('signUp', () => {
        let save

        beforeEach(() => {
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({ save })
        })

        it('Successfully signs up the user', async () => {
            save.mockResolvedValue({})
            await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
        })

        it('Throws Username Already Exists Exception', async () => {
            save.mockRejectedValue({ code: '23505' })
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
                ConflictException
            )
        })

        it('Throws Internal Server Error Exception', async () => {
            save.mockRejectedValue({})
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
                InternalServerErrorException
            )
        })
    })

    describe('validateUserPassword', () => {
        let user

        beforeEach(() => {
            userRepository.findOne = jest.fn()

            user = new User()
            user.username = 'TestUser'
            user.validatePassword = jest.fn()
        })

        it('User password is valid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(result).toEqual(true)
        })

        it('User Does Not Exist', async () => {
            userRepository.findOne.mockResolvedValue(null)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).not.toBeCalled()
            expect(result).toEqual(false)
        })

        it('Password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).toBeCalled()
            expect(result).toEqual(false)
        })

        describe('hashPassword', () => {
            it('calls bucrpit.hash to generate a hash', async () => {
                bcrypt.hash = jest.fn().mockReturnValue('testHash')
                expect(bcrypt.hash).not.toBeCalled()
                const result = await userRepository.hashPassword('TestPassword', 'TestSalt')
                expect(bcrypt.hash).toBeCalledWith('TestPassword', 'TestSalt')
                expect(result).toEqual('testHash')
            })
        })
    })
})
