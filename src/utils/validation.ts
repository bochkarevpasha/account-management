import type { AccountFormData, ValidationErrors, AccountType } from '@/types/account'

export const validateAccount = (data: AccountFormData): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Валидация меток (максимум 50 символов)
  if (data.labels && data.labels.length > 50) {
    errors.labels = 'Метки не могут содержать более 50 символов'
  }

  // Валидация типа записи
  if (!data.type || !['LDAP', 'Локальная'].includes(data.type)) {
    errors.type = 'Необходимо выбрать тип записи'
  }

  // Валидация логина
  if (!data.login || data.login.trim().length === 0) {
    errors.login = 'Логин обязателен для заполнения'
  } else if (data.login.length > 100) {
    errors.login = 'Логин не может содержать более 100 символов'
  }

  // Валидация пароля (только для локального типа)
  if (data.type === 'Локальная') {
    if (!data.password || data.password.trim().length === 0) {
      errors.password = 'Пароль обязателен для локального типа'
    } else if (data.password.length > 100) {
      errors.password = 'Пароль не может содержать более 100 символов'
    }
  }

  return errors
}

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0
}

export const getAccountTypeOptions = (): { label: string; value: AccountType }[] => {
  return [
    { label: 'LDAP', value: 'LDAP' },
    { label: 'Локальная', value: 'Локальная' }
  ]
}
