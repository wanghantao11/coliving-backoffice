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

import { Client } from './client'

export interface IProjectFacade {
  client_id: number
  name: string
  address?: string
  cover_image_source?: string
  cover_image_text?: string
  post_area?: string
  published?: boolean
  published_at?: Date
  landlord_name?: string
  landlord_email?: string
  landlord_org_no?: string
  landlord_street?: string
  landlord_zip?: string
  landlord_post_area?: string
  property_unit_designation?: string
  coliving_hub?: string
  is_auto_offer_flow?: boolean
}

@ApiModel({
  description : 'Project Facade entity',
  name : 'ProjectFacade',
})
@Entity()
export class ProjectFacade implements IProjectFacade {
  // factory method
  public static generateProjectFacade(facade: IProjectFacade) {
    const _facade = new ProjectFacade()
    Object.keys(facade).forEach(key => {
      _facade[key] = facade[key]
    })
    return Promise.resolve(_facade)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project facade',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of client',
    example: 1 as any,
    required: true,
  })
  @Column()
  public client_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Name of the project facade',
    example: 'Lab' as any,
    required: true,
  })
  @Column({ length: 100, unique: true })
  public name: string

  @ApiModelProperty({
    type: 'string',
    description: 'Address of the project facade',
    example: 'Vasagatan 12' as any,
    required: false,
  })
  @Column({ nullable: true })
  public address?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the cover image of the project facade',
    example: 'http://test.com/cover-image.jpg' as any,
    required: false,
  })
  @Column({ nullable: true })
  public cover_image_source?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Text under the cover image of the project facade',
    example: 'Kitchen corner' as any,
    required: false,
  })
  @Column({ nullable: true })
  public cover_image_text?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Postal area of the project facade',
    example: 'Stockholm' as any,
    required: false,
  })
  @Column({ length: 250 })
  public post_area?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the project facade is published',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public published: boolean

  @ApiModelProperty({
    type: 'date',
    description: 'Date when the project facade is published',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true })
  public published_at?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord name of the project facade',
    example: 'PEAB AB' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public landlord_name?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord email address of the project facade',
    example: 'landlord@test.com' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public landlord_email?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord orgnization number of the project facade',
    example: '8888-888' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public landlord_org_no?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord street address of the project facade',
    example: 'Vasagatan 12' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public landlord_street?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord postal code of the project facade',
    example: '19111' as any,
    required: false,
  })
  @Column({ length: 50, nullable: true })
  public landlord_zip?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Landlord postal area of the project facade',
    example: 'Stockholm' as any,
    required: false,
  })
  @Column({ length: 50, nullable: true })
  public landlord_post_area?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Unit designation of the project facade',
    example: '5851 Colive' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public property_unit_designation?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Coliving hub name of the project facade',
    example: 'Colive 1 AB' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public coliving_hub?: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'Is offer flow automatic',
    example: false as any,
    required: false,
  })
  @Column({ default: false })
  public is_auto_offer_flow: boolean
}
