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

import { PAYMENT_STATUS } from '../../infrastructure/constants'
import { ProjectFacade } from './projectFacade'
import { User } from './user'

export interface IPayment {
  amount: number
  currency: string
  iduser: string
  facade_id: number
  failed_reason?: string
  is_overdue?: boolean
  paid_at?: Date
  receipt_url?: string
  refunded?: boolean
  rent: number
  stripe_charge_id?: string
  stripe_customer_id?: string
  status: string
}

@ApiModel({
  description : 'Payment entity',
  name : 'Payment',
})
@Entity()
export class Payment implements IPayment {
  public static generatePayment = (payment: IPayment) => {
    const _payment = new Payment()
    Object.keys(payment).forEach(key => {
      _payment[key] = payment[key]
    })
    return Promise.resolve(_payment)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of payment',
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
    description: 'Id of project facade',
    example: 10 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Amount of the payment',
    example: 5000 as any,
    required: true,
  })
  @Column()
  public amount: number

  @ApiModelProperty({
    type: 'string',
    description: 'Currency of the payment',
    example: 'SEK' as any,
    required: true,
  })
  @Column()
  public currency: string

  @ApiModelProperty({
    type: 'string',
    description: 'Failed reason of the payment',
    example: 'insufficient_fund' as any,
    required: false,
  })
  @Column({ nullable: true })
  public failed_reason?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the payment is overdue',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public is_overdue?: boolean

  @ApiModelProperty({
    type: 'string',
    description: 'The receipt URL of the payment',
    example: 'https://test.com/payment_receipt' as any,
    required: false,
  })
  @Column({ nullable: true })
  public receipt_url?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the payment is refunded',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public refunded?: boolean

  @ApiModelProperty({
    type: 'integer',
    description: 'The amount of the rent for the payment',
    example: 3500 as any,
    required: true,
  })
  @Column()
  public rent: number

  @Column({ nullable: true })
  public stripe_charge_id: string

  @Column({ nullable: true })
  public stripe_customer_id: string

  @ApiModelProperty({
    type: 'string',
    description: 'Status of the payment',
    example: 'succeeded' as any,
    required: false,
  })
  @Column({ type: 'enum', enum: PAYMENT_STATUS, default: PAYMENT_STATUS.CREATED })
  public status: PAYMENT_STATUS

  @ApiModelProperty({
    type: 'date',
    description: 'The date when the payment is paid',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'date' })
  public paid_at?: Date

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date
}
