<template>
  <n-layout has-sider class="dashboard-layout">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed="collapsed"
      :collapsed-width="64"
      :width="200"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="logo">
        {{ collapsed ? 'HW' : 'HWTE' }}
      </div>
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered>
        <div class="header-content">
          <span>{{ authStore.user?.name }}</span>
          <span class="roles">{{ authStore.user?.roles.join(', ') }}</span>
        </div>
      </n-layout-header>

      <n-layout-content class="content">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NIcon
} from 'naive-ui';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const collapsed = ref(false);
const activeKey = ref(route.path);

const menuOptions = [
  { label: '儀表板', key: '/' },
  { label: '專案總覽', key: '/projects' },
  { label: '使用者管理', key: '/users' },
  { label: '系統設定', key: '/settings' },
  { label: '登出', key: 'logout', danger: true }
];

function handleMenuClick(key: string) {
  if (key === 'logout') {
    authStore.logout();
    router.push('/login');
  } else {
    router.push(key);
  }
}
</script>

<style scoped>
.dashboard-layout {
  height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 700;
  background: #001529;
}

.header-content {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.roles {
  color: #64748b;
}

.content {
  padding: 16px;
  background: #f5f5f5;
}
</style>