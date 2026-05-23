<template>
  <div class="projects-page">
    <n-card title="專案列表" bordered>
      <template #header-extra>
        <n-button type="primary" @click="router.push('/projects/create')">
          新增專案
        </n-button>
      </template>

      <n-space vertical :size="12">
        <n-space>
          <n-input
            v-model:value="searchText"
            placeholder="搜尋專案名稱"
            clearable
            style="width: 200px"
          />

          <n-select
            v-model:value="statusFilter"
            :options="statusOptions"
            placeholder="篩選狀態"
            clearable
            style="width: 150px"
          />
        </n-space>

        <n-data-table
          :columns="columns"
          :data="filteredProjects"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
        />
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard,
  NButton,
  NInput,
  NSelect,
  NSpace,
  NDataTable,
  NTag,
  useMessage
} from 'naive-ui';
import { projectApi } from '../services/api';
import type { Project } from '../types';

const router = useRouter();
const message = useMessage();

const loading = ref(false);
const projects = ref<Project[]>([]);
const searchText = ref('');
const statusFilter = ref<string | null>(null);

const statusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '審批中', value: 'APPROVAL' },
  { label: '已批准', value: 'APPROVED' },
  { label: '進行中', value: 'IN_PROGRESS' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已終止', value: 'TERMINATED' }
];

const statusColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  DRAFT: 'default',
  APPROVAL: 'info',
  APPROVED: 'success',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  TERMINATED: 'error'
};

const statusLabels: Record<string, string> = {
  DRAFT: '草稿',
  APPROVAL: '審批中',
  APPROVED: '已批准',
  IN_PROGRESS: '進行中',
  COMPLETED: '已完成',
  TERMINATED: '已終止'
};

const columns = [
  { title: '專案名稱', key: 'name' },
  { title: '專案代碼', key: 'code' },
  { title: '類型', key: 'type' },
  {
    title: '狀態',
    key: 'status',
    render: (row: Project) =>
      h(NTag, { type: statusColors[row.status] }, () => statusLabels[row.status])
  },
  { title: '專案經理', key: ['projectManager', 'name'] },
  {
    title: '建立日期',
    key: 'createdAt',
    render: (row: Project) => new Date(row.createdAt).toLocaleDateString('zh-TW')
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: Project) =>
      h(
        NButton,
        { text: true, type: 'primary', onClick: () => router.push(`/projects/${row.id}`) },
        () => '檢視'
      )
  }
];

const pagination = { pageSize: 10 };

const filteredProjects = computed(() =>
  projects.value.filter((p) => p.name.toLowerCase().includes(searchText.value.toLowerCase()))
);

onMounted(async () => {
  try {
    loading.value = true;
    const response = await projectApi.getAll(statusFilter.value || undefined);
    projects.value = response.data;
  } catch (error) {
    message.error('取得專案列表失敗');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.projects-page {
  padding: 16px;
}
</style>