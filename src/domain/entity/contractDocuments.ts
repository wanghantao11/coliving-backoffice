import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm'

import { CONTRACT_DOCUMENT_TYPE } from '../../infrastructure/constants'
import { Contract } from './contract'

export interface IContractDocuments {
  contract_id: number
  type: string
  source: string
}

@Unique(['contract_id', 'type'])

@ApiModel({
  description : 'Contract Documents entity',
  name : 'ContractDocuments',
})
@Entity()
export class ContractDocuments implements IContractDocuments {
  // factory method
  public static generateContractTemplates(document: IContractDocuments) {
    const _document = new ContractDocuments()
    Object.keys(document).forEach(key => {
      _document[key] = document[key]
    })
    return Promise.resolve(_document)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the contract document',
    example: 12 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => Contract, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  public contract: Contract

  @ApiModelProperty({
    type: 'integer',
    description: 'Contract id the contract document belongs to',
    example: 2 as any,
    required: true,
  })
  @Column()
  public contract_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the contract document',
    example: 'http://test.com/document-1.jpg' as any,
    required: true,
  })
  @Column()
  public source: string

  @ApiModelProperty({
    type: 'string',
    description: 'Type of the contract document',
    example: '' as any,
    required: true,
  })
  @Column({ type: 'enum', enum: CONTRACT_DOCUMENT_TYPE })
  public type: CONTRACT_DOCUMENT_TYPE
}
