import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

export interface IOfferEvent {
  iduser: string
  type: string
  data?: object
  log?: object
}

@ApiModel({
  description : 'Offer Events entity',
  name : 'OfferEvents',
})
@Entity()
export class OfferEvents implements IOfferEvent {
  public static generateOfferEvent = (event: IOfferEvent) => {
    const _event = new OfferEvents()
    Object.keys(event).forEach(key => {
      _event[key] = event[key]
    })
    return Promise.resolve(_event)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of offer event',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id?: number

  @ApiModelProperty({
    type: 'string',
    description: 'Id of member',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column()
  public iduser: string

  @ApiModelProperty({
    type: 'string',
    description: 'Type of the offer event',
    example: 'offer_sent' as any,
    required: true,
  })
  @Column()
  public type: string

  @ApiModelProperty({
    type: 'integer',
    description: 'The project facade id the offer event belongs to',
    example: 10 as any,
    required: true,
  })
  @Column()
  public facade_id: number

  @ApiModelProperty({
    type: 'json',
    description: 'Data of the offer event',
    example: '{"offer": {"id": 296, "iduser": "7259687e-6458-4859-97ff-3e3b1p2ad837", "status": "Pending", "room_id": 65, "facade_id": 5, "is_sent_by_admin": true}}' as any,
    required: true,
  })
  @Column({ type: 'jsonb', nullable: true})
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
