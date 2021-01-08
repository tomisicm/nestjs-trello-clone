import * as bcrypt from 'bcryptjs'
import { User } from '../user.entity'

describe('User entity', () => {
    describe('validatePassword', () => {
        let user: User
        const testSalt = 'testSalt'
        const testPassword = 'testPassword'

        beforeEach(() => {
            user = new User()
            user.password = testPassword
            user.salt = testSalt

            bcrypt.hash = jest.fn()
        })

        it('returns true if password is valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword')
            expect(bcrypt.hash).not.toBeCalled()

            const result = await user.validatePassword('testPassword')

            expect(bcrypt.hash).toBeCalledWith(testPassword, testSalt)
            expect(result).toBeTruthy()
        })

        it('returns false if password is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword')
            expect(bcrypt.hash).not.toBeCalled()

            const result = await user.validatePassword('wrongPassword')

            expect(bcrypt.hash).toBeCalledWith('wrongPassword', testSalt)
            expect(result).toBeFalsy()
        })
    })
})
