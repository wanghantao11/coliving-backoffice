import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

import { OFFER_STATUS } from '../../infrastructure/constants/room'
import { ProjectFacade } from './projectFacade'
import { Room } from './room'
import { User } from './user'

export interface IOffer {
  iduser: string
  facade_id: number
  room_id: number
  status?: string
  is_preferences_matched: boolean
  is_sent_by_admin?: boolean
  matching_score?: number
}

@Unique(['iduser', 'room_id'])

@ApiModel({
  description : 'Offer entity',
  name : 'Offer',
})
@Entity()
export class Offer implements IOffer {
  // factory method
  public static generateOffer = (offer: IOffer) => {
    const _offer = new Offer()
    Object.keys(offer).forEach(key => {
      _offer[key] = offer[key]
    })
    return Promise.resolve(_offer)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of offer',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: User

  @ApiModelProperty({
    type: 'string',
    description: 'Id of member',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column()
  public iduser: string

  @ManyToOne(() => ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'facade_id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the project facade',
    example: 1 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number

  @ManyToOne(() => Room, room => room.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'room_id' })
  public room: Room

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the room of the offer',
    example: 1 as any,
    required: true,
  })
  @Column('int', { name: 'room_id', nullable: false })
  public room_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'status of offer',
    example: 'Accepted' as any,
    required: true,
  })
  @Column({ type: 'enum', enum: OFFER_STATUS, default: OFFER_STATUS.PENDING })
  public status?: OFFER_STATUS

  @Column()
  public is_preferences_matched: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the offer is sent by admin',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public is_sent_by_admin: boolean

  @ApiModelProperty({
    type: 'integer',
    description: 'The matching score of the user when getting this offer',
    example: '78.82' as any,
    required: false,
  })
  @Column('float', { nullable: true })
  public matching_score: number
}
