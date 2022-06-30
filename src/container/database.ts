import { container } from '.'
import { TypeORMConnectionService } from './../infrastructure/persistence/typeorm/service'

container
  .bind<TypeORMConnectionService>('TypeORMConnectionService')
  .to(TypeORMConnectionService)
  .inSingletonScope()
