import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { CONTRACT_STATUS } from '../../infrastructure/constants'
import { ProjectFacade } from './projectFacade'
import { Room } from './room'
import { User } from './user'

export interface IContract {
  iduser: string
  room_id: number
  facade_id: number
  external_id?: number
  external_participant_id?: number
  start_date?: Date
  end_date?: Date
  rejected_at?: Date
  signed_at?: Date
  activated_at?: Date
  terminated_at?: Date
  status?: CONTRACT_STATUS
}

@ApiModel({
  description : 'Contract entity',
  name : 'Contract',
})
@Entity()
export class Contract implements IContract {
  public static generateContract = (contract: IContract) => {
    const _contract = new Contract()
    Object.keys(contract).forEach(key => {
      _contract[key] = contract[key]
    })
    return Promise.resolve(_contract)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of contract',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

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
    description: 'The project facade id of the contract',
    example: 2 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number

  @ManyToOne(() => Room, room => room.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'room_id' })
  public room: Room

  @ApiModelProperty({
    type: 'integer',
    description: 'The room id of the contract',
    example: 5 as any,
    required: true,
  })
  @Column('int', { name: 'room_id', nullable: false })
  public room_id: number

  @Column({ nullable: true })
  public external_id: number

  @Column({ nullable: true })
  public external_participant_id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The start date of the contract',
    example: '2020-01-01' as any,
    required: false,
  })
  @Column('date', { nullable: true })
  public start_date: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The start date of the contract',
    example: '2020-01-01' as any,
    required: false,
  })
  @Column('date', { nullable: true })
  public end_date: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The date the contract is rejected by candidate',
    example: '2020-01-01' as any,
    required: false,
  })
  @Column({ nullable: true })
  public rejected_at?: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The date the contract is signed by candidate',
    example: '2020-01-01' as any,
    required: false,
  })
  @Column({ nullable: true })
  public signed_at?: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The date the contract is activated by admin',
    example: '2020-01-01' as any,
    required: false,
  })
  @Column({ nullable: true })
  public activated_at?: Date

  @ApiModelProperty({
    type: 'date',
    description: 'The date the contract is terminated by admin',
    example: '2020-03-31' as any,
    required: false,
  })
  @Column({ nullable: true })
  public terminated_at?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'The status of the contract',
    example: 'pending' as any,
    required: true,
  })
  @Column({ type: 'enum', enum: CONTRACT_STATUS, default: CONTRACT_STATUS.PENDING })
  public status?: CONTRACT_STATUS
}
