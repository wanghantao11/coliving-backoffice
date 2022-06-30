import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

export interface IInterests {
  value: string
}

@Unique(['value'])

@ApiModel({
  description : 'Interests entity',
  name : 'Interests',
})
@Entity()
export class Interests implements IInterests {
  @ApiModelProperty({
    type: 'integer',
    description: 'Id of interest',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Value of interest',
    example: 'sports' as any,
    required: true,
  })
  @Column()
  public value: string
}
