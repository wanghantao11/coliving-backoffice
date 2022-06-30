import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

export interface IContractEvents {
  iduser?: string
  type: string
  facade_id: number
  data?: object
  log?: object
}

@ApiModel({
  description : 'Contract Events entity',
  name : 'ContractEvents',
})
@Entity()
export class ContractEvents implements IContractEvents {

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of contract event',
    example: 12 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id?: number

  @ApiModelProperty({
    type: 'string',
    description: 'Id of member',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: false,
  })
  @Column({ nullable: true })
  public iduser?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Type of the contract event',
    example: 'contract_signed' as any,
    required: true,
  })
  @Column()
  public type: string

  @ApiModelProperty({
    type: 'integer',
    description: 'Project facade id of the contract event',
    example: 2 as any,
    required: true,
  })
  @Column()
  public facade_id: number

  @ApiModelProperty({
    type: 'json',
    description: 'Data of the contract event',
    example: '{contracts: [{id: 61, iduser: "7259687e-6458-4859-97ff-3e3b1p2ad837", status: "Signed", room_id: 10, facade_id: 2, start_date: "2020-09-01"}]}' as any,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  public data?: object

  @ApiModelProperty({
    type: 'json',
    description: 'Log of the contract event',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  public log?: object

  @CreateDateColumn()
  public created_at?: Date
}
