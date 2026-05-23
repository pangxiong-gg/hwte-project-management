<template>
  <div class="create-project-page">
    <n-card title="新增專案" bordered>
      <n-form ref="formRef" :model="form" :rules="rules" label-placement="top">
        <n-grid :cols="2" :x-gap="24">
          <n-gi>
            <n-form-item label="名稱" path="name">
              <n-input v-model:value="form.name" placeholder="請輸入專案名稱" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="代碼" path="code">
              <n-input v-model:value="form.code" placeholder="請輸入專案代碼" />
            </n-form-item>
          </n-gi>
        </n-grid>

        <n-form-item label="類型" path="type">
          <n-select
            v-model:value="form.type"
            :options="typeOptions"
            placeholder="請選擇專案類型"
          />
        </n-form-item>

        <n-form-item label="業務背景" path="businessBackground">
          <n-input
            v-model:value="form.businessBackground"
            type="textarea"
            placeholder="請輸入業務背景"
            :rows="3"
          />
        </n-form-item>

        <n-form-item label="核心目標" path="coreGoals">
          <n-input
            v-model:value="form.coreGoals"
            type="textarea"
            placeholder="請輸入核心目標"
            :rows="3"
          />
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button type="primary" :loading="loading" @click="handleSubmit">
              送出
            </n-button>
            <n-button @click="router.push('/projects')">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NGrid,
  NGi,
  useMessage
} from 'naive-ui';
import { projectApi } from '../services/api';

const router = useRouter();
const message = useMessage();

const formRef = ref();
const loading = ref(false);

const form = ref({
  name: '',
  code: '',
  type: '',
  businessBackground: '',
  coreGoals: ''
});

const rules = {
  name: { required: true, message: '請輸入專案名稱' },
  code: { required: true, message: '請輸入專案代碼' },
  type: { required: true, message: '請選擇專案類型' }
};

const typeOptions = [
  { label: 'E化系統', value: 'E化系統' },
  { label: '硬體設備', value: '硬體設備' },
  { label: '顧問專案', value: '顧問專案' },
  { label: '其他', value: '其他' }
];

async function handleSubmit() {
  try {
    formRef.value?.validate();
    loading.value = true;
    await projectApi.create(form.value);
    message.success('專案建立成功');
    router.push('/projects');
  } catch (error) {
    message.error('專案建立失敗');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.create-project-page {
  padding: 16px;
  max-width: 800px;
}
</style>