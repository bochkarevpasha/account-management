<template>
  <div class="account-management">
    <header class="page-header">
      <h1 class="page-title">Управление учетными записями</h1>
      <Button
        label="Добавить учетную запись"
        icon="pi pi-plus"
        severity="success"
        @click="addNewAccount"
      />
    </header>

    <AccountsTable
      ref="accountsTableRef"
      :accounts="accounts"
    />

    <div v-if="accounts.length > 0" class="accounts-summary">
      <p>Всего учетных записей: {{ accountsCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import AccountsTable from './AccountsTable.vue'
import { useAccountsStore } from '@/stores/accounts'

const accountsStore = useAccountsStore()
const accountsTableRef = ref()

const accounts = computed(() => accountsStore.accounts)
const accountsCount = computed(() => accountsStore.accountsCount)

const addNewAccount = () => {
  accountsTableRef.value?.createNewAccount()
}
</script>

<style scoped>
.account-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

/* .accounts-list {
  margin-bottom: 30px;
} */

.accounts-summary {
  text-align: center;
  padding: 16px;
  background: #e8f5e8;
  border-radius: 8px;
  color: #2d5a2d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .page-title {
    text-align: center;
    font-size: 1.5rem;
  }

  .account-management {
    padding: 16px;
  }
}
</style>
