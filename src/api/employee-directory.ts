import { buildClient } from '../hooks'

export type Position = {
  id: string
  title: string
}

export type Employee = {
  id: string
  first_name: string | undefined
  last_name: string | undefined
  age: number | undefined
  current_position: Position | undefined
  positions: Position[] | undefined
}

export const employeeDirectoryApi = buildClient<{
  'employees' : Employee
  'positions' : Position
}>()
