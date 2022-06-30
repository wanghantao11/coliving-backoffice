import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { PROJECT_STATUS } from '../../infrastructure/constants'
import { ProjectFacade } from './projectFacade'

export interface IProject {
  facade_id: number
  client_id: number
  about_location?: string
  about_location_en?: string
  about_project?: string
  about_project_en?: string
  about_other_info?: string
  about_other_info_en?: string
  apartments?: number
  city?: string
  community_features?: string[]
  country?: string
  cover_image_source?: string
  cover_image_text?: string
  distance_to_public_transport?: string
  floor_map_source?: string
  floor_map_text?: string
  is_published?: boolean
  key_features?: string[]
  move_in_date?: Date
  name: string
  published_at?: Date
  room_features?: string[]
  room_rent_from?: number
  room_rent_to?: number
  room_size_from?: number
  room_size_to?: number
  roomies_from?: number
  roomies_to?: number
  service_fee?: number
  shared_area_size_from?: number
  shared_area_size_to?: number
  status?: PROJECT_STATUS
  street?: string
  third_party_services?: string[]
  zip?: string
}

@ApiModel({
  description : 'Project entity',
  name : 'Project',
})
@Entity()
export class Project implements IProject {
  // factory method
  public static generateProject(project: IProject) {
    const _project = new Project()
    Object.keys(project).forEach(key => {
      _project[key] = project[key]
    })
    return Promise.resolve(_project)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @OneToOne(() => ProjectFacade, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facade_id', referencedColumnName: 'id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of project facade',
    example: 10 as any,
    required: true,
  })
  @Column({ unique: true })
  public facade_id: number

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
    description: 'Location description of the project',
    example: 'The project is located in the center of the city, only 5 minutes from the metro station by walk.' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  public about_location: string

  @Column({ nullable: true, type: 'text' })
  public about_location_en: string

  @ApiModelProperty({
    type: 'string',
    description: 'General description of the project',
    example: 'The project contains 5 buildings with totally 220 flats.' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  public about_project: string

  @Column({ nullable: true, type: 'text' })
  public about_project_en: string

  @ApiModelProperty({
    type: 'string',
    description: 'Other information description of the project',
    example: 'Smoking and pets are not allowed in the flats.' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  public about_other_info?: string

  @Column({ nullable: true, type: 'text' })
  public about_other_info_en?: string

  @ApiModelProperty({
    type: 'integer',
    description: 'The total number of apartments in the project',
    example: 20 as any,
    required: false,
  })
  @Column({ nullable: true })
  public apartments?: number

  @ApiModelProperty({
    type: 'string',
    description: 'The city of the project',
    example: 'Stockholm' as any,
    required: false,
  })
  @Column({ nullable: true })
  public city?: string

  @Column('varchar', { array: true, length: 100, nullable: true })
  public community_features?: string[]

  @ApiModelProperty({
    type: 'string',
    description: 'The country of the project',
    example: 'Sweden' as any,
    required: false,
  })
  @Column({ nullable: true })
  public country?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the cover image of the project',
    example: 'http://test.com/cover-image.jpg' as any,
    required: false,
  })
  @Column({ nullable: true })
  public cover_image_source: string

  @ApiModelProperty({
    type: 'string',
    description: 'Text under the cover image of the project',
    example: 'The kitchen corner' as any,
    required: false,
  })
  @Column({ nullable: true })
  public cover_image_text?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Distance to the public transport of the project',
    example: '100m-500m' as any,
    required: false,
  })
  @Column({ nullable: true })
  public distance_to_public_transport?: string

  @ApiModelProperty({
    type: 'string',
    description: 'Url of the floor map image of the project',
    example: 'http://test.com/floor-map.jpg' as any,
    required: false,
  })
  @Column({ nullable: true })
  public floor_map_source: string

  @ApiModelProperty({
    type: 'string',
    description: 'Text under the floor map of the project',
    example: 'The floor map of room A' as any,
    required: false,
  })
  @Column({ nullable: true })
  public floor_map_text?: string

  @Column('varchar', { array: true, nullable: true })
  public key_features?: string[]

  @ApiModelProperty({
    type: 'date',
    description: 'Move-in date of the project',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'date' })
  public move_in_date?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'Name of the project',
    example: 'Lab' as any,
    required: true,
  })
  @Column({ length: 100, unique: true })
  public name: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the project is published',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public is_published: boolean

  @Column({ nullable: true })
  public published_at?: Date

  @Column('varchar', { array: true, nullable: true })
  public room_features?: string[]

  @ApiModelProperty({
    type: 'integer',
    description: 'Lowest rent of the project',
    example: 2000 as any,
    required: false,
  })
  @Column({ nullable: true })
  public room_rent_from: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Highest rent of the project',
    example: 5000 as any,
    required: false,
  })
  @Column({ nullable: true })
  public room_rent_to: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Lowest room size of the project',
    example: 12 as any,
    required: false,
  })
  @Column({ nullable: true })
  public room_size_from: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Highest room size of the project',
    example: 100 as any,
    required: false,
  })
  @Column({ nullable: true })
  public room_size_to: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Lowest number of flatmates of the project',
    example: 2 as any,
    required: false,
  })
  @Column({ nullable: true })
  public roomies_from: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Highest number of flatmates of the project',
    example: 20 as any,
    required: false,
  })
  @Column({ nullable: true })
  public roomies_to: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Service fee of the project',
    example: 1500 as any,
    required: false,
  })
  @Column({ nullable: true })
  public service_fee: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Lowest shared area size of the project',
    example: 50 as any,
    required: false,
  })
  @Column({ nullable: true })
  public shared_area_size_from: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Highest number of flatmates of the project',
    example: 150 as any,
    required: false,
  })
  @Column({ nullable: true })
  public shared_area_size_to: number

  @ApiModelProperty({
    type: 'string',
    description: 'Status of the project',
    example: 'occupied' as any,
    required: false,
  })
  @Column({ type: 'enum', enum: PROJECT_STATUS, default: PROJECT_STATUS.DEFAULT })
  public status?: PROJECT_STATUS

  @ApiModelProperty({
    type: 'string',
    description: 'Street address of the project',
    example: 'Vasagatan 12' as any,
    required: false,
  })
  @Column({ nullable: true })
  public street?: string

  @Column('varchar', { array: true, nullable: true })
  public third_party_services?: string[]

  @ApiModelProperty({
    type: 'string',
    description: 'Postal code of the project',
    example: '19111' as any,
    required: false,
  })
  @Column({ nullable: true })
  public zip?: string
}
