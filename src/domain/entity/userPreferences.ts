import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import { PERIOD_OF_STAY } from './../../infrastructure/constants'
import { User } from './user'

export interface IUserPreferences {
  iduser: number
  locations: string[]
  roomies: number[]
  rent_from?: number
  rent_to?: number
  is_suitable_for_disability: boolean
  has_private_bathroom: boolean
  has_private_toilet: boolean
  has_single_room: boolean
  has_double_room: boolean
  has_room_type_preference: boolean
  move_in_date_from: Date
  move_in_date_to: Date
  period_of_stay: PERIOD_OF_STAY
  needs_contact_back: boolean
  needs_manual_offer: boolean
}

@Unique(['iduser'])

@ApiModel({
  description : 'User Preferences entity',
  name : 'UserPreferences',
})
@Entity()
export class UserPreferences implements IUserPreferences {
  // factory method
  public static generateUserPreferences = (preferences: Partial<IUserPreferences>) => {
    const _preferences = new UserPreferences()
    Object.keys(preferences).forEach(key => {
      _preferences[key] = preferences[key]
    })
    return Promise.resolve(_preferences)
  }

  @OneToOne(() => User, user => user.preferences, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser' })
  public user: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of user',
    example: 10 as any,
    required: true,
  })
  @PrimaryColumn()
  public iduser: number

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user prefers single room',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: true })
  public has_single_room: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user prefers double room',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public has_double_room: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user prefers private bathroom',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public has_private_bathroom: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user prefers private toilet',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public has_private_toilet: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user has selected a room type',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: true })
  public has_room_type_preference: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If user prefers a room with handicapped favor',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public is_suitable_for_disability: boolean

  @ApiModelProperty({
    type: 'string[]',
    description: 'List of preferred locations of the user',
    example: ['10002', '10004', '10012'],
    required: false,
  })
  @Column('character varying', { array: true, nullable: true })
  public locations: string[]

  @ApiModelProperty({
    type: 'date',
    description: 'The preferred earliest move-in date of the user',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true,  type: 'date' })
  public move_in_date_from: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The preferred latest move-in date of the user',
    example: '2021-02-03' as any,
    required: false,
  })
  @Column({ nullable: true,  type: 'date' })
  public move_in_date_to: Date

  @ApiModelProperty({
    type: 'string',
    description: 'The preferred period of the stay',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column('enum', { enum: PERIOD_OF_STAY, default: PERIOD_OF_STAY.NOT_SPECIFIED })
  public period_of_stay: PERIOD_OF_STAY

  @ApiModelProperty({
    type: 'integer',
    description: 'The preferred lowest rent',
    example: 3000 as any,
    required: false,
  })
  @Column({ nullable: true })
  public rent_from?: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The preferred highest rent',
    example: 10000 as any,
    required: false,
  })
  @Column({ nullable: true })
  public rent_to?: number

  @ApiModelProperty({
    type: 'integer[]',
    description: 'The list of preferred flatmates the user wants to live with',
    example: 3000 as any,
    required: false,
  })
  @Column('integer', { array: true, nullable: true })
  public roomies: number[]

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user needs admin to contact back',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public needs_contact_back: boolean

  @Column({ default: false })
  public needs_manual_offer: boolean
}
