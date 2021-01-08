import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    salt: string

    async validatePassword(incPassword: string): Promise<boolean> {
        const incPasswordHash = await bcrypt.hash(incPassword, this.salt)
        return incPasswordHash === this.password
    }
}
