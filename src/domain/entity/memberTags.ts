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

import { Client } from './client'

export interface IMemberTags {
  client_id: number
  name: string
}

@Unique(['name'])

@ApiModel({
  description : 'MemberTags entity',
  name : 'MemberTags',
})
@Entity()
export class MemberTags implements IMemberTags {
  // factory method
  public static generateMemberTags = (tag: IMemberTags) => {
    const _tag = new MemberTags()
    Object.keys(tag).forEach(key => {
      _tag[key] = tag[key]
    })
    return _tag
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of member tag',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the client the member tag belongs to',
    example: 2 as any,
    required: true,
  })
  @ManyToOne(
    () => Client,
    client => client.id,
    { onDelete: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'client_id' })
  public client_id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'name of the member tag',
    example: 'Contacted candidate' as any,
    required: true,
  })
  @Column()
  public name: string
}
