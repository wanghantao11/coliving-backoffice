import { IProcessor } from 'typeorm-fixtures-cli'
import { UserScore } from '../../src/domain/entity'

export default class UserScoreProcessor implements IProcessor<UserScore> {

  private randomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1 )) + min
  }

  public preProcess(name: string, object: any): any {
    // Add any prop you want to customize in your fixture
    return {
      ...object,
      agreeableness: this.randomNumberBetween(1, 6),
      conscientiousness: this.randomNumberBetween(1, 6),
      emotional_stability: this.randomNumberBetween(1, 6),
      extroversion: this.randomNumberBetween(1, 6),
      openness: this.randomNumberBetween(1, 6),
      activity: this.randomNumberBetween(1, 6),
      conformity: this.randomNumberBetween(1, 6),
      engagement: this.randomNumberBetween(1, 6),
      hedonism: this.randomNumberBetween(1, 6),
      humanism: this.randomNumberBetween(1, 6),
      performance: this.randomNumberBetween(1, 6),
      power: this.randomNumberBetween(1, 6),
      safety: this.randomNumberBetween(1, 6),
      tradition: this.randomNumberBetween(1, 6),
    }
  }
}
