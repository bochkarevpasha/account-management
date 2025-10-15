import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, Label } from '@/types/account'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const loadAccounts = () => {
    const stored = localStorage.getItem('accounts')
    if (stored) {
      try {
        accounts.value = JSON.parse(stored)
      } catch (error) {
        console.error('Error loading accounts from localStorage:', error)
        accounts.value = []
      }
    }
  }

  const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  const parseLabels = (labelsString: string): Label[] => {
    if (!labelsString.trim()) return []
    
    return labelsString
      .split(';')
      .map((label: string) => label.trim())
      .filter(label => label.length > 0)
      .map((label: string) => ({ text: label }))
  }

  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      id: crypto.randomUUID()
    }
    accounts.value.push(newAccount)
    saveAccounts()
    return newAccount
  }

  const updateAccount = (id: string, accountData: Partial<Omit<Account, 'id'>>) => {
    const index = accounts.value.findIndex(account => account.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...accountData }
      saveAccounts()
    }
  }

  const removeAccount = (id: string) => {
    const index = accounts.value.findIndex(account => account.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
      saveAccounts()
    }
  }

  const getAccount = (id: string) => {
    return accounts.value.find(account => account.id === id)
  }

  const accountsCount = computed(() => accounts.value.length)

  loadAccounts()

  return {
    accounts,
    accountsCount,
    addAccount,
    updateAccount,
    removeAccount,
    getAccount,
    parseLabels,
    loadAccounts,
    saveAccounts
  }
})
