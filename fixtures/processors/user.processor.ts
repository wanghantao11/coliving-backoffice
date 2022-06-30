import { IProcessor } from 'typeorm-fixtures-cli'
import { User } from '../../src/domain/entity'

export default class UserProcessor implements IProcessor<User> {

  public postProcess(name: string, object: { [key: string]: any }): void {
    object.email = object.email.toLowerCase()
    object.img_url = 'https://firebasestorage.googleapis.com/v0/b/colive-auth-stage.appspot.com/o/images%2FDefaultProfileImage.png?alt=media&token=4454115e-1a34-401b-91d5-80d477e85e4b'
  }
}
