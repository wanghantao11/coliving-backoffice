import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

import { ProjectFacade, User, Client } from './'

@Unique(['iduser', 'facade_id'])

@ApiModel({
  description : 'Application entity',
  name : 'Application',
})
@Entity()
export class Application {
  constructor(iduser: string, facadeId: number, clientId: number) {
    this.iduser = iduser
    this.facade_id = facadeId
    this.client_id = clientId
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of application',
    example: [1, 123],
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => User, user => user.application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: string

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

  @ManyToOne(() => Client, client => client.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'client_id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of client',
    example: 1 as any,
    required: true,
  })
  @Column('int', { name: 'client_id', nullable: false })
  public client_id: number

  @CreateDateColumn()
  public created_at?: Date
}
