import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'

import { DEFAULT_PROFILE_IMAGE } from './../../infrastructure/constants'
import { Client } from './client'
import { Role } from './role'

export interface IAdmin {
  client_id: number
  role_id?: number
  email: string
  first_name: string
  img_url?: string
  last_name: string
  password?: string
  projects?: number[]
  type?: string
  verified?: boolean
}

@Unique(['email'])

@ApiModel({
  description : 'Admin entity',
  name : 'Admin',
})
@Entity()
export class Admin implements IAdmin {
  // factory method
  public static generateAdmin = (admin: IAdmin) => {
    const _admin = new Admin()
    Object.keys(admin).forEach(key => {
      _admin[key] = admin[key]
    })
    return Promise.resolve(_admin)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of admin',
    example: 12 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ApiModelProperty({
    description: 'First name of the admin',
    type: 'string',
    example: 'James' as any,
    required: true,
  })
  @Column()
  public first_name: string

  @ApiModelProperty({
    description: 'Last name of the admin',
    type: 'string',
    example: 'Coliver' as any,
    required: true,
  })
  @Column()
  public last_name: string

  @Column({ default: 'sv', length: 2 })
  public language: string

  @ApiModelProperty({
    type: 'integer',
    description: 'Client id the admin belongs to',
    example: 2 as any,
    required: true,
  })
  @ManyToOne(
    () => Client,
    client => client.id,
    { onDelete: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'client_id' })
  public client_id: number

  @ApiModelProperty({
    type: 'integer',
    format: 'int64',
    description: 'Role id of the admin',
    example: 12 as any,
    required: true,
  })
  @ManyToOne(() => Role, role => role.id )
  @JoinColumn({ name: 'role_id' })
  public role_id?: number

  @ApiModelProperty({
    description: 'Email of the admin',
    type: 'email',
    example: 'test@test.com' as any,
    required: true,
  })
  @Column()
  public email: string

  @ApiModelProperty({
    description: 'Password of the admin',
    type: 'string',
    example: 'aI1f4W_d!j9' as any,
    required: false,
  })
  @Column({ nullable: true })
  public password?: string

  @ApiModelProperty({
    type: 'integer[]',
    description: 'List of project facade ids the admin has access to',
    example: [1, 10, 12],
    required: false,
  })
  @Column('integer', { array: true, nullable: true })
  public facade_ids: number[]

  @ApiModelProperty({
    description: 'Url of the admin profile image',
    type: 'email',
    example: 'https://test.com/image_url.jpg' as any,
    required: false,
  })
  @Column({ default: DEFAULT_PROFILE_IMAGE, length: 255 })
  public img_url: string

  @ApiModelProperty({
    description: 'Type of the admin',
    type: 'string',
    example: ['default', 'admin'],
    required: false,
  })
  @Column({ default: 'default' })
  public type: string

  @Column({ default: false })
  public verified?: boolean

  @Column({ nullable: true, length: 255 })
  public verification_code?: string
}
