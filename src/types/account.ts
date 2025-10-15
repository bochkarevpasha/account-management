export type AccountType = 'LDAP' | 'Локальная'

export interface Label {
  text: string
}

export interface Account {
  id: string
  labels: Label[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountFormData {
  labels: string
  type: AccountType
  login: string
  password: string
}

export interface ValidationErrors {
  labels?: string
  type?: string
  login?: string
  password?: string
}
