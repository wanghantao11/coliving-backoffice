import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'
import { User } from './user'

export interface IAdminMemberNotes {
  iduser: string
  description: string
  tag_ids?: number[]
}

@Unique(['iduser'])

@ApiModel({
  description : 'Admin member notes entity',
  name : 'AdminMemberNotes',
})
@Entity()
export class AdminMemberNotes implements IAdminMemberNotes {
  @OneToOne(() => User, user => user.iduser, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: string

  @ApiModelProperty({
    type: 'string',
    description: 'member id',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @PrimaryColumn()
  public iduser: string

  @ApiModelProperty({
    type: 'string',
    description: 'admin notes for the member',
    example: 'Call the member tomorrow.' as any,
    required: false,
  })
  @Column({ nullable: true })
  public description: string

  @ApiModelProperty({
    type: 'interger[]',
    description: 'admin tags for the member',
    example: [1, 22, 24],
    required: false,
  })
  @Column('integer', { array: true, nullable: true })
  public tag_ids: number[]
}
