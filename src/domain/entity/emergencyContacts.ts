import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  CreateDateColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

import { DEFAULT_PROFILE_IMAGE } from './../../infrastructure/constants'
import { User } from './user'

export interface IEmergencyContacts {
  iduser: string
  name: string
  image?: string
  phone: string
  relation: string
}

@Unique(['iduser', 'phone'])

@ApiModel({
  description : 'Emergency Contacts entity',
  name : 'EmergencyContacts',
})
@Entity()
export class EmergencyContacts implements IEmergencyContacts {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: User

  @ApiModelProperty({
    type: 'string',
    description: 'Id of member',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column()
  public iduser: string

  @ApiModelProperty({
    type: 'string',
    description: 'Name of the emergency contact',
    example: 'Victor' as any,
    required: true,
  })
  @Column({ length: 100 })
  public name: string

  @ApiModelProperty({
    type: 'string',
    description: 'Url of profile image of the emergency contact',
    example: 'https://test.com/image_url.jpg' as any,
    required: false,
  })
  @Column({ length: 255, default: DEFAULT_PROFILE_IMAGE })
  public image?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Phone number of the emergency contact',
    example: '+46 71111111' as any,
    required: true,
  })
  @Column({ length: 50 })
  public phone: string

  @ApiModelProperty({
    type: 'string',
    description: 'Relation of the emergency contact to the member',
    example: 'parent' as any,
    required: true,
  })
  @Column({ length: 50 })
  public relation: string

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date
}
