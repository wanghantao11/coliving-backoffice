import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'
import { User } from './user'

export interface IUserProfiles {
  iduser: string
  interest_ids: number[]
  display_name?: string
  hometown?: string
  occupation?: string
  schools?: string[]
  food_preference?: string
  gluten_intolerent: boolean
  wheat_intolerent: boolean
  lactose_intolerent: boolean
  allergic_to_milk: boolean
  allergic_to_egg: boolean
  allergic_to_shellfish: boolean
  allergic_to_fish: boolean
  allergic_to_nuts: boolean
  fun_facts: string[]
}

@Unique(['iduser'])

@ApiModel({
  description : 'User Profiles entity',
  name : 'UserProfiles',
})
@Entity()
export class UserProfiles implements IUserProfiles {

  // factory method
  public static generateUserProfiles = (profiles: Partial<IUserProfiles>) => {
    const _profiles = new UserProfiles()
    Object.keys(profiles).forEach(key => {
      _profiles[key] = profiles[key]
    })
    return Promise.resolve(_profiles)
  }

  @OneToOne(() => User, user => user.userProfiles, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: string

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the user',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @PrimaryColumn()
  public iduser: string

  @ApiModelProperty({
    type: 'integer[]',
    description: 'List of interest ids of the user',
    example: [1,2,6,7,12],
    required: false,
  })
  @Column('integer', { array: true, nullable: true })
  public interest_ids: number[]

  @ApiModelProperty({
    type: 'string',
    description: 'Displayed name of the user',
    example: 'Captain Cook' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public display_name?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Hometown of the user',
    example: 'Malmö' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public hometown?: string

  @ApiModelProperty({
    type: 'string',
    description: 'occupation of the user',
    example: 'Engineer' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public occupation?: string

  @ApiModelProperty({
    type: 'string[]',
    description: 'Schools of the user',
    example: ['Stockholm Gymnasium','Harvard', 'MIT'],
    required: false,
  })
  @Column('character varying', { array: true, nullable: true })
  public schools?: string[]

  @ApiModelProperty({
    type: 'string',
    description: 'Food preference of the user',
    example: 'pescatarian' as any,
    required: false,
  })
  @Column({ length: 50, nullable: true })
  public food_preference?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to gluten',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public gluten_intolerent: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to wheat',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public wheat_intolerent: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to lactose',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public lactose_intolerent: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to milk',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public allergic_to_milk: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to egg',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public allergic_to_egg: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to shellfish',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public allergic_to_shellfish: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to fish',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public allergic_to_fish: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the user is allergic to nuts',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public allergic_to_nuts: boolean

  @ApiModelProperty({
    type: 'json',
    description: 'Fun facts of the user',
    example: '{"1": "Love to paint the house", "2": "Afraid of height"}' as any,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  public fun_facts: string[]

}
