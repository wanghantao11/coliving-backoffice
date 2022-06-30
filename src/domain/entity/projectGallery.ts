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

import { Project } from './project'

@ApiModel({
  description : 'Project Gallery entity',
  name : 'ProjectGallery',
})
@Entity()
export class ProjectGallery {
  constructor(source: string, text?: string, projectId?: number) {
    this.source = source
    this.text = text
    this.project_id = projectId
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project gallery',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at: Date

  @UpdateDateColumn()
  public updated_at: Date

  @ManyToOne(() => Project, project => project.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'project_id' })
  public project: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project',
    example: 10 as any,
    required: true,
  })
  @Column('int', { name: 'project_id', nullable: false })
  public project_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the project gallery',
    example: 'http://test.com/project-gallery-1.jpg' as any,
    required: true,
  })
  @Column()
  public source: string

  @ApiModelProperty({
    type: 'string',
    description: 'Text under the project gallery',
    example: 'The balcony overview' as any,
    required: false,
  })
  @Column({ nullable: true })
  public text: string
}
