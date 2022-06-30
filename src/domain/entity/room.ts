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

import { ROOM_STATUS } from '../../infrastructure/constants'
import { Address } from './address'
import { Apartment } from './apartment'
import { ProjectFacade } from './projectFacade'

export interface IRoom {
  facade_id: number
  address_id: number
  apartment_id?: number
  apartment_plan_uri?: string
  floor_no?: string
  name?: string
  notes?: string
  number: string
  has_private_bathroom?: boolean
  has_private_kitchen?: boolean
  has_private_toilet?: boolean
  is_suitable_for_disability?: boolean
  label_ids?: number[]
  move_in_date?: Date
  people_per_room: number
  rent: number
  service_fee: number
  shared_area_size: number
  size: number
  status?: ROOM_STATUS
}

@ApiModel({
  description : 'Room entity',
  name : 'Room',
})
@Entity()
export class Room implements IRoom {
  // factory method
  public static generateRoom = (room: IRoom) => {
    const _room = new Room()
    Object.keys(room).forEach(key => {
      _room[key] = room[key]
    })
    return Promise.resolve(_room)
  }

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
    type: 'integer',
    description: 'Id of room',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => Address, address => address.id, { nullable: false })
  @JoinColumn({ name: 'address_id' })
  public address: Address

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of address',
    example: 8 as any,
    required: true,
  })
  @Column('int', { name: 'address_id', nullable: false })
  public address_id: number

  @ManyToOne(() => Apartment, apartment => apartment.id)
  @JoinColumn({ name: 'apartment_id' })
  public apartment: Apartment

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of apartment',
    example: 9 as any,
    required: false,
  })
  @Column('int', { name: 'apartment_id', nullable: true })
  public apartment_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'The apartment plan map where the room belongs to',
    example: 'http://test.com/apartment-plan.jpg' as any,
    required: true,
  })
  @Column({ length: 100, nullable: true })
  public apartment_plan_uri: string

  @ApiModelProperty({
    type: 'string',
    description: 'The floor number of the room',
    example: 'Våning 2' as any,
    required: true,
  })
  @Column({ length: 100, nullable: true })
  public floor_no: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the room has private bathroom',
    example: 'true' as any,
    required: true,
  })
  @Column({ default: false })
  public has_private_bathroom: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the room has private kitchen',
    example: 'true' as any,
    required: true,
  })
  @Column({ default: false })
  public has_private_kitchen: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the room has private toilet',
    example: 'true' as any,
    required: true,
  })
  @Column({ default: false })
  public has_private_toilet: boolean

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the room is suitable for disabled people',
    example: 'true' as any,
    required: true,
  })
  @Column({ default: false })
  public is_suitable_for_disability: boolean

  @ApiModelProperty({
    type: 'integer[]',
    description: 'List of label ids of the room',
    example: [1,2,5,6],
    required: true,
  })
  @Column('integer', { array: true, nullable: true })
  public label_ids: number[]

  @ApiModelProperty({
    type: 'date',
    description: 'Move-in date of the room',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true, type: 'date' })
  public move_in_date?: Date

  @ApiModelProperty({
    type: 'string',
    description: 'Name of the room',
    example: 'Rose' as any,
    required: false,
  })
  @Column({ nullable: true })
  public name: string

  @ApiModelProperty({
    type: 'string',
    description: 'The notes of the room by the admin',
    example: 'The room is reserved for Johan' as any,
    required: false,
  })
  @Column({ nullable: true })
  public notes: string

  @ApiModelProperty({
    type: 'string',
    description: 'Room number',
    example: 'Lgh 1201' as any,
    required: true,
  })
  @Column({ length: 200 })
  public number: string

  @ApiModelProperty({
    type: 'integer',
    description: 'The number of people in the room',
    example: 2 as any,
    required: true,
  })
  @Column()
  public people_per_room: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The rent of the room',
    example: 5000 as any,
    required: true,
  })
  @Column('float')
  public rent: number

  @ApiModelProperty({
    type: 'integer',
    description: 'Service fee of the room',
    example: 1500 as any,
    required: true,
  })
  @Column('float')
  public service_fee: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The shared area size of the apartment where the room belongs to',
    example: 150 as any,
    required: false,
  })
  @Column({ nullable: true })
  public shared_area_size: number

  @ApiModelProperty({
    type: 'integer',
    description: 'The room size',
    example: 20 as any,
    required: true,
  })
  @Column()
  public size: number

  @ApiModelProperty({
    type: 'string',
    description: 'The room status',
    example: 'Available' as any,
    required: true,
  })
  @Column({ type: 'enum', enum: ROOM_STATUS, default: ROOM_STATUS.AVAILABLE })
  public status?: ROOM_STATUS
}
