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

export interface IApartment {
  facade_id: number
  name: string
}

@Unique(['facade_id', 'name'])

@ApiModel({
  description : 'Apartment entity',
  name : 'Apartment',
})
@Entity()
export class Apartment implements IApartment {
  // factory method
  public static generateApartment = (apartment: IApartment) => {
    const _apartment = new Apartment()
    Object.keys(apartment).forEach(key => {
      _apartment[key] = apartment[key]
    })
    return _apartment
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of apartment',
    example: [1, 123],
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
    description: 'The name of the apartment',
    example: 'Lgh 2, våning 8' as any,
    required: true,
  })
  @Column()
  public name: string

  @ManyToOne(() => ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'facade_id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'The project facade id the apartment belongs to',
    example: 10 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number
}
