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
import { ProjectFacade } from './projectFacade'

export interface ILabel {
  facade_id: number
  name: string
}

@Unique(['facade_id', 'name'])

@ApiModel({
  description : 'Label entity',
  name : 'Label',
})
@Entity()
export class Label implements ILabel {
  // factory method
  public static generateLabel = (label: ILabel) => {
    const _label = new Label()
    Object.keys(label).forEach(key => {
      _label[key] = label[key]
    })
    return _label
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of label',
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
    type: 'string',
    description: 'Name of the label',
    example: 1 as any,
    required: true,
  })
  @Column()
  public name: string

  @ManyToOne(() => ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'facade_id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Project facade id of the label',
    example: 1 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number
}
