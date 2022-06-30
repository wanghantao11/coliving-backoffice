import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import { User } from './user'

export interface IUserScore {
  iduser: string
  // Big Five Personality
  agreeableness: number
  conscientiousness: number
  emotional_stability: number
  extroversion: number
  openness: number

  // 9 Values
  activity: number
  conformity: number
  engagement: number
  hedonism: number
  humanism: number
  performance: number
  power: number
  safety: number
  tradition: number
}

@Unique(['iduser'])

@Entity()
export class UserScore implements IUserScore {
  // factory method
  public static generateUserScore = (userScore: Partial<IUserScore>) => {
    const _userScore = new UserScore()
    Object.keys(userScore).forEach(key => {
      _userScore[key] = userScore[key]
    })
    return Promise.resolve(_userScore)
  }

  @OneToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' })
  public user: User

  @PrimaryColumn()
  public iduser: string

  @CreateDateColumn()
  public created_at?: Date

  @Column('numeric', { precision: 3, scale: 2 })
  public agreeableness: number

  @Column('numeric', { precision: 3, scale: 2 })
  public conscientiousness: number

  @Column('numeric', { precision: 3, scale: 2 })
  public emotional_stability: number

  @Column('numeric', { precision: 3, scale: 2 })
  public extroversion: number

  @Column('numeric', { precision: 3, scale: 2 })
  public openness: number

  @Column('numeric', { precision: 3, scale: 2 })
  public activity: number

  @Column('numeric', { precision: 3, scale: 2 })
  public conformity: number

  @Column('numeric', { precision: 3, scale: 2, nullable: true })
  public engagement: number

  @Column('numeric', { precision: 3, scale: 2 })
  public hedonism: number

  @Column('numeric', { precision: 3, scale: 2 })
  public humanism: number

  @Column('numeric', { precision: 3, scale: 2 })
  public performance: number

  @Column('numeric', { precision: 3, scale: 2 })
  public power: number

  @Column('numeric', { precision: 3, scale: 2 })
  public safety: number

  @Column('numeric', { precision: 3, scale: 2 })
  public tradition: number
}
