<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAccountsStore } from '@/stores/accounts'
import { validateAccount, getAccountTypeOptions } from '@/utils/validation'
import type { Account, AccountFormData, ValidationErrors } from '@/types/account'

interface Props {
  modelValue: boolean
  account?: Account | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accountsStore = useAccountsStore()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.account)

const formData = ref<AccountFormData>({
  labels: '',
  type: 'Локальная',
  login: '',
  password: ''
})

const errors = ref<ValidationErrors>({})

const accountTypeOptions = getAccountTypeOptions()

const showPasswordField = computed(() => {
  return formData.value.type === 'Локальная'
})

const initializeForm = () => {
  if (props.account) {
    const labelsString = props.account.labels.map(label => label.text).join('; ')
    
    formData.value = {
      labels: labelsString,
      type: props.account.type,
      login: props.account.login,
      password: props.account.password || ''
    }
  } else {
    formData.value = {
      labels: '',
      type: 'Локальная',
      login: '',
      password: ''
    }
  }
  errors.value = {}
}

const onTypeChange = () => {
  if (formData.value.type === 'LDAP') {
    formData.value.password = ''
  }
}

const onSave = () => {
  const validationErrors = validateAccount(formData.value)
  errors.value = validationErrors

  if (Object.keys(validationErrors).length === 0) {
    const labels = accountsStore.parseLabels(formData.value.labels)
    
    const accountData = {
      labels,
      type: formData.value.type,
      login: formData.value.login.trim(),
      password: formData.value.type === 'Локальная' ? formData.value.password.trim() : null
    }

    if (props.account) {
      // Обновляем существующую учетную запись
      accountsStore.updateAccount(props.account.id, accountData)
    } else {
      // Добавляем новую учетную запись
      accountsStore.addAccount(accountData)
    }

    emit('saved')
    visible.value = false
  }
}

const onCancel = () => {
  visible.value = false
}

const onDialogHide = () => {
  errors.value = {}
}

watch(visible, (newValue) => {
  if (newValue) {
    initializeForm()
  }
})

watch(() => props.account, () => {
  if (visible.value) {
    initializeForm()
  }
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Редактировать учетную запись' : 'Новая учетная запись'"
    :modal="true"
    class="p-fluid"
    @hide="onDialogHide"
  >
    <div class="modal-content">
      <div class="p-field">
        <label for="edit-labels">Метка</label>
        <InputText
          id="edit-labels"
          v-model="formData.labels"
          placeholder="Введите метки через точку с запятой"
          :class="{ 'p-invalid': errors.labels }"
          maxlength="50"
        />
        <small v-if="errors.labels" class="p-error">{{ errors.labels }}</small>
        <small v-else class="p-text-secondary">Метки вводятся через знак ; (максимум 50 символов)</small>
      </div>

      <div class="p-field">
        <label for="edit-type">Тип записи *</label>
        <Dropdown
          id="edit-type"
          v-model="formData.type"
          :options="accountTypeOptions"
          option-label="label"
          option-value="value"
          placeholder="Выберите тип записи"
          :class="{ 'p-invalid': errors.type }"
          @change="onTypeChange"
        />
        <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
      </div>

      <div class="p-field">
        <label for="edit-login">Логин *</label>
        <InputText
          id="edit-login"
          v-model="formData.login"
          placeholder="Введите логин"
          :class="{ 'p-invalid': errors.login }"
          maxlength="100"
        />
        <small v-if="errors.login" class="p-error">{{ errors.login }}</small>
      </div>

      <div v-if="showPasswordField" class="p-field">
        <label for="edit-password">Пароль *</label>
        <Password
          id="edit-password"
          v-model="formData.password"
          placeholder="Введите пароль"
          :class="{ 'p-invalid': errors.password }"
          :maxlength="100"
          toggleMask
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>
    </div>

    <template #footer>
      <Button
        label="Отмена"
        icon="pi pi-times"
        outlined
        severity="danger"
        @click="onCancel"
      />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        @click="onSave"
      />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}
</style>
