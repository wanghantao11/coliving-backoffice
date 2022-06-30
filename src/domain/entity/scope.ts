import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

export interface IScope {
  value: string
}

@Unique(['value'])

@ApiModel({
  description : 'Scope entity',
  name : 'Scope',
})
@Entity()
export class Scope implements IScope {
  // factory method
  public static generateUser = (scope: IScope) => {
    const _scope = new Scope()
    Object.keys(scope).forEach(key => {
      _scope[key] = scope[key]
    })
    return _scope
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of scope',
    example: 10 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Value of the scope',
    example: 10 as any,
    required: true,
  })
  @Column()
  public value: string
}
