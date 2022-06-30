import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

import { DEFAULT_PROFILE_IMAGE, USER_TYPE } from './../../infrastructure/constants'
import { Application } from './application'
import { Client } from './client'
import { UserPreferences } from './userPreferences'
import { UserProfiles } from './userProfiles'

export interface IUser {
  iduser: string
  client_id: number
  email?: string
  password?: string
  first_name: string
  last_name: string
  birthday?: Date
  img_url?: string
  description?: string
  preferences?: UserPreferences
  tos_version_accepted: number
  user_type?: string
  phone?: string
  is_test_complete?: boolean
  verification_code?: string
  gender?: string
  language?: string
  is_verified?: boolean
  stripe_customer_id?: string
  stripe_has_saved_card?: boolean
}

@Unique(['email'])
@Unique(['iduser'])

@ApiModel({
  description : 'User entity',
  name : 'User',
})
@Entity()
export class User implements IUser {
  // factory method
  public static generateUser = (user: IUser) => {
    const _user = new User()
    Object.keys(user).forEach(key => {
      _user[key] = user[key]
    })
    return Promise.resolve(_user)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of user',
    example: 10 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public user_key: number

  @ApiModelProperty({
    type: 'string',
    description: 'External id of the user',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column({ length: 255 })
  public iduser: string

  @ManyToOne(() => Client, client => client.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'client_id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the client the user belongs to',
    example: 1 as any,
    required: true,
  })
  @Column()
  public client_id: number

  @ApiModelProperty({
    type: 'date',
    description: 'Registration time of the user',
    example: '2020-09-01 16:17:28.4161' as any,
    required: false,
  })
  @CreateDateColumn()
  public registration_time?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'Email of the user',
    example: 'email@test.com' as any,
    required: true,
  })
  @Column({ length: 255, nullable: true })
  public email: string

  @ApiModelProperty({
    type: 'string',
    description: 'Password of the user',
    example: 'aI1f4W_d!j9' as any,
    required: true,
  })
  @Column({ nullable: true })
  public password?: string

  @ApiModelProperty({
    type: 'string',
    description: 'First name of the user',
    example: 'James' as any,
    required: true,
  })
  @Column({ length: 255 })
  public first_name: string

  @ApiModelProperty({
    type: 'string',
    description: 'Last name of the user',
    example: 'Coliver' as any,
    required: true,
  })
  @Column({ length: 255 })
  public last_name: string

  @ApiModelProperty({
    type: 'date',
    description: 'Birthday of the user',
    example: '1995-02-02' as any,
    required: false,
  })
  @Column('date', { nullable: true })
  public birthday: Date

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the profile image of the user',
    example: 'http://test.com/profile-image.jpg' as any,
    required: true,
  })
  @Column({ length: 255, default: DEFAULT_PROFILE_IMAGE })
  public img_url: string

  @ApiModelProperty({
    type: 'string',
    description: 'Self-introduction of the user',
    example: 'Hi, I am James and 28 years old. I love sports and reading.' as any,
    required: false,
  })
  @Column('text', { default: '' })
  public description: string

  @Column('numeric')
  public tos_version_accepted: number

  @ApiModelProperty({
    type: 'string',
    description: 'Type of the user',
    example: 'Tenant' as any,
    required: false,
  })
  @Column({ length: 45, nullable: true, default: USER_TYPE.LIGHT })
  public user_type: string

  @ApiModelProperty({
    type: 'string',
    description: 'Phone number of the user',
    example: '+46711111111' as any,
    required: false,
  })
  @Column({ nullable: true, length: 50 })
  public phone?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user has completed the roomie test',
    example: 'true' as any,
    required: true,
  })
  @Column({ default: false })
  public is_test_complete?: boolean

  @Column({ nullable: true, length: 255 })
  public verification_code?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Gender of the user',
    example: 'Male' as any,
    required: false,
  })
  @Column({ default: 'secret' })
  public gender?: string

  @OneToMany(
    () => Application,
    application => application.user
  )
  public application?: Application

  @OneToOne(
    () => UserPreferences,
    preferences => preferences.user
  )
  public preferences?: UserPreferences

  @OneToOne(
    () => UserProfiles,
    userProfiles => userProfiles.user
  )
  public userProfiles?: UserProfiles

  @ApiModelProperty({
    type: 'string',
    description: 'User preferred language',
    example: 'sv' as any,
    required: false,
  })
  @Column({ default: 'sv', length: 2 })
  public language: string

  @Column({ default: true })
  public is_verified: boolean

  @Column({ nullable: true })
  public stripe_customer_id: string

  @Column({ default: false })
  public stripe_has_saved_card: boolean
}
