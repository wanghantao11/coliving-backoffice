import { container } from '.'
import { IsAuthorized } from '../application/middleware/authorization'
import { IsAuthenticated } from '../application/middleware/authentication'
import { Authorization } from '../application/auth/authorization'

container.bind<Authorization>('Authorization').to(Authorization)

container.bind<IsAuthorized>('isAuthorized').to(IsAuthorized)

container.bind<IsAuthenticated>('isAuthenticated').to(IsAuthenticated)
