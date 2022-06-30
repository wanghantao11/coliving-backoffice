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

import { ProjectFacade } from './projectFacade'

export interface IAddress {
  facade_id: number
  careof?: string
  city: string
  country: string
  street: string
  zip: string
}

@ApiModel({
  description : 'Address entity',
  name : 'Address',
})
@Entity()
export class Address implements IAddress {
  // factory method
  public static generateAddress = (address: IAddress) => {
    const _address = new Address()
    Object.keys(address).forEach(key => {
      _address[key] = address[key]
    })
    return Promise.resolve(_address)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of address',
    example: [1, 123],
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'facade_id' })
  public facade: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Facade id the address belong to',
    example: 10 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number

  @ApiModelProperty({
    description: 'Careof of the address',
    type: 'string',
    example: 'William' as any,
    required: false,
  })
  @Column({ default: '' })
  public careof: string

  @ApiModelProperty({
    description: 'City of the address',
    type: 'string',
    example: 'Stockholm' as any,
    required: false,
  })
  @Column()
  public city: string

  @ApiModelProperty({
    description: 'Country of the address',
    type: 'string',
    example: 'Sweden' as any,
    required: false,
  })
  @Column()
  public country: string

  @ApiModelProperty({
    description: 'Street of the address',
    type: 'string',
    example: 'Vasagatan 12' as any,
    required: false,
  })
  @Column()
  public street: string

  @ApiModelProperty({
    description: 'Post code of the address',
    type: 'string',
    example: '19 110' as any,
    required: false,
  })
  @Column()
  public zip: string
}
