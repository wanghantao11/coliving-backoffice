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

import { INCIDENT_REPORT_STATUS } from '../../infrastructure/constants'
import { Admin } from './admin'
import { Client } from './client'
import { ProjectFacade } from './projectFacade'

export interface IIncidentReport {
  client_id: number
  facade_id: number
  category: string
  closed_at?: Date
  decline_reason?: string
  description: string
  estimated_done_date?: Date
  is_private: boolean
  feedback?: string
  location?: string
  subcategory: string
  photos?: string[]
  owner_comment?: string
  owner_id: number
  priority?: string
  reporter_id: string
  satisfaction_level?: string
  status: INCIDENT_REPORT_STATUS
  title: string
}

@Unique(['facade_id', 'title'])

@ApiModel({
  description : 'Incident Report entity',
  name : 'IncidentReport',
})
@Entity()
export class IncidentReport implements IIncidentReport {
  // factory method
  public static generateIncidentReport = (incidentReport: IIncidentReport) => {
    const _incidentReport = new IncidentReport()
    Object.keys(incidentReport).forEach(key => {
      _incidentReport[key] = incidentReport[key]
    })
    return Promise.resolve(_incidentReport)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of incident report',
    example: 1 as any,
    required: true,
  })
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public created_at?: Date

  @UpdateDateColumn()
  public updated_at?: Date

  @ManyToOne(() => Client, client => client.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'client_id' })
  public client: Client

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the client the incident report belongs to',
    example: 1 as any,
    required: true,
  })
  @Column()
  public client_id: number

  @ManyToOne(
    () => ProjectFacade,
    projectFacade => projectFacade.id,
    { onDelete: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'facade_id' })
  public facade: ProjectFacade

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of the project facade the incident report belongs to',
    example: 1 as any,
    required: true,
  })
  @Column('int', { name: 'facade_id', nullable: false })
  public facade_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'Title of the incident report',
    example: 1 as any,
    required: true,
  })
  @Column({ length: 200 })
  public title: string

  @ApiModelProperty({
    type: 'date',
    description: 'The date when the incident report is closed or declined',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true })
  public closed_at: Date

  @ApiModelProperty({
    type: 'string',
    description: 'The reason the incident report gets declined',
    example: 'The problem does not exist' as any,
    required: false,
  })
  @Column({ nullable: true })
  public decline_reason: string

  @ApiModelProperty({
    type: 'string',
    description: 'The description of the incident report',
    example: 'The window of the kitchen is broken' as any,
    required: true,
  })
  @Column()
  public description: string

  @ApiModelProperty({
    type: 'date',
    description: 'The estimated date when the incident report will be completed',
    example: '2021-02-02' as any,
    required: false,
  })
  @Column({ nullable: true })
  public estimated_done_date: Date

  @ApiModelProperty({
    type: 'string',
    description: 'The feedback from the reporter',
    example: 'It is nicely fixed in time. Thank you!' as any,
    required: false,
  })
  @Column({ nullable: true })
  public feedback: string

  @ApiModelProperty({
    type: 'string',
    description: 'The Location of the incident report',
    example: 'building' as any,
    required: false,
  })
  @Column({ nullable: true })
  public location: string

  @ApiModelProperty({
    type: 'boolean',
    description: 'If the incident report can be seen by other tenants',
    example: 'true' as any,
    required: false,
  })
  @Column({ default: false })
  public is_private: boolean

  @ApiModelProperty({
    type: 'string',
    description: 'The category of the incident report',
    example: 'property' as any,
    required: false,
  })
  @Column()
  public category: string

  @ApiModelProperty({
    type: 'string',
    description: 'The subcategory of the incident report',
    example: 'electronics' as any,
    required: false,
  })
  @Column()
  public subcategory: string

  @ApiModelProperty({
    type: 'string[]',
    description: 'The urls of photos of the incident report',
    example: '["https://test.com/incident_report_photo1.jpg", "https://test.com/incident_report_photo2.jpg"]' as any,
    required: false,
  })
  @Column('text', { array: true, nullable: true })
  public photos: string[]

  @ApiModelProperty({
    type: 'string',
    description: 'The comment from the owner of the incident report',
    example: 'Need to contact the plumber' as any,
    required: false,
  })
  @Column({ nullable: true })
  public owner_comment: string

  @ManyToOne(() => Admin, admin => admin.id, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  public owner: Admin

  @ApiModelProperty({
    type: 'integer',
    description: 'The id of the owner of the incident report',
    example: 12 as any,
    required: true,
  })
  @Column()
  public owner_id: number

  @ApiModelProperty({
    type: 'string',
    description: 'The priority of the incident report',
    example: 'EMERGENCY' as any,
    required: false,
  })
  @Column({ nullable: true })
  public priority: string

  @ApiModelProperty({
    type: 'string',
    description: 'The id of the reporter of the incident report',
    example: '7259687e-6458-4859-97ff-3e3b1p2ad837' as any,
    required: true,
  })
  @Column()
  public reporter_id: string

  @ApiModelProperty({
    type: 'string',
    description: 'The satisfaction level of the reporter',
    example: 'happy' as any,
    required: false,
  })
  @Column({ nullable: true })
  public satisfaction_level: string

  @ApiModelProperty({
    type: 'string',
    description: 'The status of the incident report',
    example: 'In_progress' as any,
    required: true,
  })
  @Column({ type: 'enum', enum: INCIDENT_REPORT_STATUS, default: INCIDENT_REPORT_STATUS.CREATED })
  public status: INCIDENT_REPORT_STATUS
}
