import * as scope from './scope'

export const SITE_ADMIN = {
  name: 'site_admin',
  scopes: [scope.FULL],
}
export const PROJECT_MANAGER = {
  name: 'project_manager',
  scopes: [scope.ACCOMMODATION_FULL, scope.APPLICATION_READ, scope.ROOM_FULL, scope.CONTRACT_FULL, scope.ADMIN_READ, scope.ROLE_READ, scope.NEWSLETTER_READ, scope.USER_READ],
}
export const COMMUNITY_MANAGER = {
  name: 'community_manager',
  scopes: [scope.ACCOMMODATION_READ, scope.APPLICATION_FULL, scope.ROOM_READ, scope.CONTRACT_FULL, scope.ADMIN_READ, scope.ROLE_READ, scope.NEWSLETTER_FULL, scope.USER_FULL],
}

export const HOST = {
  name: 'host',
  scopes: [scope.INCIDENT_FULL, scope.INCIDENT_READ],
}

export const BACKOFFICE = 'backoffice'
export const COMMUNITY = 'community'
export const TENANT = 'tenant'
export const GUEST = 'guest'
