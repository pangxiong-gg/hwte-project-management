<template>
  <div class="project-detail-page">
    <n-space vertical :size="16">
      <n-button @click="router.push('/projects')">返回</n-button>

      <n-card v-if="project" title="專案詳情">
        <n-descriptions :columns="2" label-placement="left">
          <n-descriptions-item label="名稱">{{ project.name }}</n-descriptions-item>
          <n-descriptions-item label="代碼">{{ project.code }}</n-descriptions-item>
          <n-descriptions-item label="類型">{{ project.type }}</n-descriptions-item>
          <n-descriptions-item label="狀態">
            <n-tag :type="statusColors[project.status]">
              {{ statusLabels[project.status] }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="專案經理">
            {{ project.projectManager?.name || '-' }}
          </n-descriptions-item>
          <n-descriptions-item label="預算">
            {{ project.budget ? `$${project.budget}` : '-' }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-tabs type="line">
        <n-tab-pane name="basic" tab="基本資訊">
          <n-card>
            <n-descriptions :columns="1" label-placement="top">
              <n-descriptions-item label="業務背景">
                {{ project?.businessBackground || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="核心目標">
                {{ project?.coreGoals || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="說明">
                {{ project?.description || '-' }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-tab-pane>

        <n-tab-pane name="milestones" tab="里程碑">
          <n-timeline v-if="project?.milestones?.length">
            <n-timeline-item
              v-for="m in project.milestones"
              :key="m.id"
              :type="milestoneColors[m.status]"
              :title="m.name"
              :content="m.description"
            />
          </n-timeline>
          <n-empty v-else description="暫無里程碑" />
        </n-tab-pane>

        <n-tab-pane name="team" tab="團隊成員">
          <n-data-table
            v-if="project?.teams?.length"
            :columns="teamColumns"
            :data="project.teams"
            :pagination="false"
          />
          <n-empty v-else description="暫無團隊成員" />
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NSpace,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NTabs,
  NTabPane,
  NTimeline,
  NTimelineItem,
  NDataTable,
  NEmpty,
  useMessage
} from 'naive-ui';
import { projectApi } from '../services/api';
import type { Project } from '../types';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const project = ref<Project | null>(null);

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

const milestoneColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  PENDING: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  DELAYED: 'error'
};

const teamColumns = [
  { title: '姓名', key: 'user.name' },
  { title: 'Email', key: 'user.email' },
  { title: '角色', key: 'role' }
];

onMounted(async () => {
  try {
    const response = await projectApi.get(route.params.id as string);
    project.value = response.data;
  } catch (error) {
    message.error('取得專案詳情失敗');
  }
});
</script>

<style scoped>
.project-detail-page {
  padding: 16px;
}
</style>