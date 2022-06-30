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

export interface IProjectFacadeDocument {
  description: string
  facade_id: number
  title: string
  url: string
}

@ApiModel({
  description : 'Project Facade Document entity',
  name : 'ProjectFacadeDocument',
})
@Entity()
export class ProjectFacadeDocument implements IProjectFacadeDocument {
  // factory method
  public static generateProjectFacadeDocument(doc: IProjectFacadeDocument) {
    const _doc = new ProjectFacadeDocument()
    Object.keys(doc).forEach(key => {
      _doc[key] = doc[key]
    })
    return Promise.resolve(_doc)
  }

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project facade document',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

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
    type: 'string',
    description: 'Description of project facade document',
    example: 'Tenant handbook in English' as any,
    required: true,
  })
  @Column({ nullable: true })
  public description: string

  @ApiModelProperty({
    type: 'string',
    description: 'Title of project facade document',
    example: 'Handbook English' as any,
    required: true,
  })
  @Column()
  public title: string

  @ApiModelProperty({
    type: 'string',
    description: 'Path to the project facade document',
    example: 'http://test.com/handbook.pdf' as any,
    required: true,
  })
  @Column()
  public url: string
}
