import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm'

import { Client } from './client'
import { ProjectFacade } from './projectFacade'

export interface IContractTemplates {
  facade_id: number
  client_id: number
  collection_id?: number
  extra_fields?: object
}

@ApiModel({
  description : 'Contract Templates entity',
  name : 'ContractTemplates',
})
@Entity()
export class ContractTemplates implements IContractTemplates {
  // factory method
  public static generateContractTemplates(template: IContractTemplates) {
    const _template = new ContractTemplates()
    Object.keys(template).forEach(key => {
      _template[key] = template[key]
    })
    return Promise.resolve(_template)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the contract template',
    example: 12 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @OneToOne(() => ProjectFacade, projectFacade => projectFacade.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facade_id', referencedColumnName: 'id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Project facade id the contract template belongs to',
    example: 12 as any,
    required: true,
  })
  @Column()
  public facade_id: number

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Client id the contract template belongs to',
    example: 2 as any,
    required: true,
  })
  @Column()
  public client_id: number

  @Column({ nullable: true })
  public collection_id?: number

  @ApiModelProperty({
    type: 'json',
    description: 'Extra fields the contract template has other than the default fields',
    example: '{lost_key_fee: "", termination_notice: ""}' as any,
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  public extra_fields?: object
}
