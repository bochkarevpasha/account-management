<template>
  <div class="accounts-container">
    <div v-if="props.accounts.length === 0" class="empty-state">
      <i class="pi pi-info-circle"></i>
      <p>Учетные записи не найдены. Нажмите кнопку "Добавить учетную запись" для создания первой записи.</p>
    </div>
    <div v-else class="accounts-table">
      <DataTable
        :value="props.accounts"
        :paginator="true"
        :rows="10"
        striped-rows
        :rowsPerPageOptions="[5, 10, 20]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :loading="false"
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column field="labels" header="Метки" :sortable="true">
          <template #body="{ data }">
            <div class="labels-cell">
              <Tag
                v-for="label in data.labels"
                :key="label.text"
                :value="label.text"
                class="label-tag"
                severity="info"
              />
              <span v-if="data.labels.length === 0" class="no-labels">Нет меток</span>
            </div>
          </template>
        </Column>

        <Column field="type" header="Тип записи" :sortable="true">
          <template #body="{ data }">
            <Tag
              :value="data.type"
              :severity="data.type === 'LDAP' ? 'success' : 'warning'"
            />
          </template>
        </Column>

        <Column field="login" header="Логин" :sortable="true">
          <template #body="{ data }">
            <span class="login-cell">{{ data.login }}</span>
          </template>
        </Column>

        <Column field="password" header="Пароль">
          <template #body="{ data }">
            <span v-if="data.type === 'Локальная'" class="password-cell">
              {{ data.password ? '••••••••' : 'Не задан' }}
            </span>
            <span v-else class="password-cell disabled">
              Не требуется
            </span>
          </template>
        </Column>

        <Column header="Действия" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                icon="pi pi-pencil"
                class=" p-mr-2"
                rounded
                outlined
                severity="primary"
                @click="editAccount(data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="deleteAccount(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <EditAccountModal
      v-model="editDialogVisible"
      :account="editingAccount"
      @saved="onAccountSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import EditAccountModal from './EditAccountModal.vue'
import { useAccountsStore } from '@/stores/accounts'
import type { Account } from '@/types/account'

interface Props {
  accounts: Account[]
}

interface Emits {
  (e: 'account-updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accountsStore = useAccountsStore()

const editDialogVisible = ref(false)
const editingAccount = ref<Account | null>(null)

const editAccount = (account: Account) => {
  editingAccount.value = account
  editDialogVisible.value = true
}

const deleteAccount = (account: Account) => {
  accountsStore.removeAccount(account.id)
  emit('account-updated')
}

const onAccountSaved = () => {
  editDialogVisible.value = false
  editingAccount.value = null
  emit('account-updated')
}

defineExpose({
  createNewAccount: () => {
    editingAccount.value = null
    editDialogVisible.value = true
  }
})
</script>

<style scoped lang="scss">

.action-button {
  display: flex;
  gap: 0.7rem;
  padding: 0.5rem 1rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

.accounts-table {
  margin-top: 20px;
}

.labels-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.no-labels {
  color: #6c757d;
  font-size: 0.9rem;
}

.login-cell {
  font-weight: 500;
}

.password-cell {
  color: #6c757d;
}

.password-cell.disabled {
  color: #adb5bd;
}

.action-buttons {
  display: flex;
  gap: 8px;
}


:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

:deep(.p-tag) {
  font-size: 0.8rem;
  padding: 6px;
}


:deep(.p-field label) {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

@media (max-width: 768px) {
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
  }
}
</style>
