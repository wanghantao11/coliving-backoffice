import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Client } from './client'

export interface IRole {
  client_id: number
  name: string
  scopes?: number[]
}

@ApiModel({
  description : 'Role entity',
  name : 'Role',
})
@Entity()
export class Role implements IRole {
  // factory method
  public static generateRole = (role: IRole) => {
    const _role = new Role()
    Object.keys(role).forEach(key => {
      _role[key] = role[key]
    })
    return Promise.resolve(_role)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of role',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of client',
    example: 1 as any,
    required: true,
  })
  @ManyToOne(() => Client, client => client.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'client_id' })
  public client_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Name of the role',
    example: 'project_manager' as any,
    required: true,
  })
  @Column()
  public name: string

  @ApiModelProperty({
    type: 'integer[]',
    description: 'scopes for the role',
    example: [2, 3, 4, 8, 9],
    required: true,
  })
  @Column('integer', { array: true, nullable: true })
  public scopes?: number[]
}
