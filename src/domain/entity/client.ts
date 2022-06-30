import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

export interface IClient {
  org_no: string
  vat_no?: string
  name: string
  phone: string
  email: string
  address?: string
  city?: string
  zip?: string
  country: string
  type: string
  logo?: string
  stripe_account_id?: string
}

@Unique(['email'])
@Unique(['phone'])

@ApiModel({
  description : 'Client entity',
  name : 'Client',
})
@Entity()
export class Client implements IClient {
  // factory method
  public static generateClient = (client: IClient) => {
    const _client = new Client()
    Object.keys(client).forEach(key => {
      _client[key] = client[key]
    })
    return Promise.resolve(_client)
  }

  @ApiModelProperty({
    type: 'integer',
    description: 'Id of application',
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
    description: 'The client organization number',
    example: '8888-888' as any,
    required: true,
  })
  @Column({ length: 30 })
  public org_no: string

  @ApiModelProperty({
    type: 'string',
    description: 'The client VAT number',
    example: '8888-888-8888' as any,
    required: false,
  })
  @Column({ length: 24, nullable: true })
  public vat_no?: string

  @ApiModelProperty({
    type: 'string',
    description: 'The client name',
    example: 'Colive AB' as any,
    required: true,
  })
  @Column({ length: 100 })
  public name: string

  @ApiModelProperty({
    type: 'string',
    description: 'The client phone number',
    example: '+468 1111111' as any,
    required: true,
  })
  @Column({ length: 30 })
  public phone: string

  @ApiModelProperty({
    type: 'string',
    description: 'The client email',
    example: 'client@client.com' as any,
    required: true,
  })
  @Column()
  public email: string

  @ApiModelProperty({
    type: 'string',
    description: 'The client address',
    example: 'Vasagatan 12' as any,
    required: false,
  })
  @Column({ length: 100, nullable: true })
  public address?: string

  @ApiModelProperty({
    type: 'string',
    description: 'The city of the client',
    example: 'Stockholm' as any,
    required: false,
  })
  @Column({ length: 30, nullable: true })
  public city?: string

  @ApiModelProperty({
    type: 'string',
    description: 'The post code of the client',
    example: '19 191' as any,
    required: false,
  })
  @Column({ length: 10, nullable: true })
  public zip?: string

  @ApiModelProperty({
    type: 'string',
    description: 'The country of the client',
    example: 'Sweden' as any,
    required: true,
  })
  @Column({ length: 20 })
  public country: string

  @ApiModelProperty({
    type: 'string',
    description: 'The type of the client',
    example: ['default', 'admin'],
    required: true,
  })
  @Column()
  public type: string

  @ApiModelProperty({
    type: 'string',
    description: 'The url of the client logo',
    example: 'http://test.com/logo.png' as any,
    required: false,
  })
  @Column({ length: 255, nullable: true })
  public logo: string

  @Column({ nullable: true })
  public stripe_account_id: string
}
