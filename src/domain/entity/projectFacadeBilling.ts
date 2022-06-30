import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

import { Client } from './client'
import { ProjectFacade } from './projectFacade'

export interface IProjectFacadeBilling {
  client_id: number
  facade_id: number
  bankgiro_no?: string
  deposit?: number
  deposit_refund_weeks?: number
  rent_yearly_increase_rate?: number
  rent_yearly_increase_date?: string
  rent_day_of_month?: number
  service_fee_day_of_month?: number
}

@ApiModel({
  description : 'Project Facade Billing entity',
  name : 'ProjectFacadeBilling',
})
@Entity()
export class ProjectFacadeBilling implements IProjectFacadeBilling {
  // factory method
  public static generateProjectFacadeBilling(billing: IProjectFacadeBilling) {
    const _billing = new ProjectFacadeBilling()
    Object.keys(billing).forEach(key => {
      _billing[key] = billing[key]
    })
    return Promise.resolve(_billing)
  }

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @OneToOne(() => ProjectFacade, projectFacade => projectFacade.id, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facade_id', referencedColumnName: 'id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project facade',
    example: 10 as any,
    required: true,
  })
  @PrimaryColumn()
  public facade_id: number

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of client',
    example: 1 as any,
    required: true,
  })
  @Column()
  public client_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Bankgiro number of the project facade',
    example: '5050-5050' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public bankgiro_no: string

  @ApiModelProperty({
    type: 'integer',
    description: 'The number of the deposit for the project facade',
    example: 3000 as any,
    required: false,
  })
  @Column({ nullable: true })
  public deposit: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The number of weeks the deposit is refund.',
    example: 3 as any,
    required: false,
  })
  @Column({ nullable: true })
  public deposit_refund_weeks: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The numebr in percentage of how much the yearly rent increases.',
    example: 5 as any,
    required: false,
  })
  @Column({ nullable: true })
  public rent_yearly_increase_rate: number

  @ApiModelProperty({
    type: 'date',
    description: 'The date when the yearly rent increases.',
    example: '12-31' as any,
    required: false,
  })
  @Column({ nullable: true })
  public rent_yearly_increase_date: string

  @ApiModelProperty({
    type: 'integer',
    description: 'The day of the month when rent is due to pay.',
    example: 15 as any,
    required: false,
  })
  @Column({ nullable: true })
  public rent_day_of_month: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The day of the month when service fee is due to pay.',
    example: 15 as any,
    required: false,
  })
  @Column({ nullable: true })
  public service_fee_day_of_month: number
}
