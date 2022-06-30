import { Client } from './../entity'

export interface ClientDao {
  createClient(client: Client)
  deleteClient(id: number)
  getClient(id: number)
}
