import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  Check
} from 'typeorm'

import { PREFERRED_ROOMMATES_STATUS } from '../../infrastructure/constants'
import { User } from './user'

export interface IUserPreferredRoommates {
  inviter_id: string
  invitee_id: string
  created_at?: Date
  updated_at?: Date
  invitation_code?: string
  status?: string
}

@Unique(['inviter_id', 'invitee_id'])
@Check('"inviter_id" != "invitee_id"')

@ApiModel({
  description : 'User Preferred Roommates entity',
  name : 'UserPreferredRoommates',
})
@Entity()
export class UserPreferredRoommates implements IUserPreferredRoommates {
  // factory method
  public static generateUserPreferredRoomate = (
    userPreferredRoommates: Partial<IUserPreferredRoommates>
  ) => {
    const _userPreferredRoommates = new UserPreferredRoommates()
    Object.keys(userPreferredRoommates).forEach(key => {
      _userPreferredRoommates[key] = userPreferredRoommates[key]
    })
    return Promise.resolve(_userPreferredRoommates)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of user preferred roommate',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviter_id', referencedColumnName: 'iduser' })
  public inviter: User

  @ApiModelProperty({
    type: 'string',
    description: 'Id of the inviter',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column({ length: 255 })
  public inviter_id: string

  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitee_id', referencedColumnName: 'iduser' })
  public invitee: User

  @ApiModelProperty({
    type: 'string',
    description: 'Id of the invitee',
    example: '69596i7e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column({ length: 255 })
  public invitee_id: string

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @Column({ nullable: true })
  public invitation_code?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Status of the invitation',
    example: 'Accepted' as any,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: PREFERRED_ROOMMATES_STATUS,
    default: PREFERRED_ROOMMATES_STATUS.PENDING,
  })
  public status?: string
}
