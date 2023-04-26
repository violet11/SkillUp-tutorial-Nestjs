import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'

import { Base } from './base.entity'
import { Role } from './role.entity'
// import { Role } from './role.entity'

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  // Exclude means that it will not be shown when we are looking for users
  @Exclude()
  password: string

  @ManyToOne(() => Role, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role | null
}
