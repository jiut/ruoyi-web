# 前端Status字段适配指南

## 📋 问题概述

在院校数据API从Mock数据切换到后端实现时，`status`字段的格式存在差异：

| 数据源 | 格式类型 | 可选值 | 说明 |
|--------|----------|--------|------|
| **Mock数据** | 字符串枚举 | `'ACTIVE'` \| `'INACTIVE'` | 语义化状态值 |
| **后端API** | 数字字符串 | `'0'` \| `'1'` | 数据库存储格式（0=正常，1=停用） |

## 🔄 字段映射关系

### 状态值对应表

| Mock数据值 | 后端API值 | 中文含义 | 显示状态 |
|------------|-----------|----------|----------|
| `'ACTIVE'` | `'0'` | 正常/启用 | ✅ 启用 |
| `'INACTIVE'` | `'1'` | 停用/禁用 | ❌ 停用 |

## 🛠️ 前端适配方案

### 方案一：工具函数转换（推荐）

创建转换工具函数，统一处理状态值转换：

```typescript
// utils/statusConverter.ts

/**
 * 院校状态枚举
 */
export enum SchoolStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

/**
 * 后端状态值转换为前端状态值
 * @param backendStatus 后端状态值 ('0' | '1')
 * @returns 前端状态值 ('ACTIVE' | 'INACTIVE')
 */
export function convertBackendStatusToFrontend(backendStatus: string): SchoolStatus {
  return backendStatus === '0' ? SchoolStatus.ACTIVE : SchoolStatus.INACTIVE;
}

/**
 * 前端状态值转换为后端状态值
 * @param frontendStatus 前端状态值 ('ACTIVE' | 'INACTIVE')
 * @returns 后端状态值 ('0' | '1')
 */
export function convertFrontendStatusToBackend(frontendStatus: SchoolStatus): string {
  return frontendStatus === SchoolStatus.ACTIVE ? '0' : '1';
}

/**
 * 获取状态显示文本
 * @param status 状态值（支持前端或后端格式）
 * @returns 显示文本
 */
export function getStatusText(status: string): string {
  const normalizedStatus = status === '0' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  return normalizedStatus === 'ACTIVE' ? '启用' : '停用';
}

/**
 * 获取状态显示样式类名
 * @param status 状态值（支持前端或后端格式）
 * @returns CSS类名
 */
export function getStatusClass(status: string): string {
  const normalizedStatus = status === '0' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  return normalizedStatus === 'ACTIVE' ? 'status-active' : 'status-inactive';
}
```

### 方案二：API响应数据处理

在API调用层面统一处理数据转换：

```typescript
// api/school.ts

import { convertBackendStatusToFrontend, convertFrontendStatusToBackend } from '@/utils/statusConverter';

interface SchoolResponse {
  id: number;
  schoolName: string;
  status: string; // 后端返回的是 '0' | '1'
  // ... 其他字段
}

interface School {
  id: number;
  schoolName: string;
  status: 'ACTIVE' | 'INACTIVE'; // 前端使用的格式
  // ... 其他字段
}

/**
 * 转换后端院校数据为前端格式
 */
function transformSchoolData(backendData: SchoolResponse): School {
  return {
    ...backendData,
    status: convertBackendStatusToFrontend(backendData.status)
  };
}

/**
 * 获取院校列表
 */
export async function getSchoolList(params: any) {
  const response = await request.get('/designer/school/list', { params });

  // 转换状态字段格式
  if (response.data?.rows) {
    response.data.rows = response.data.rows.map(transformSchoolData);
  }

  return response;
}

/**
 * 获取院校详情
 */
export async function getSchoolById(id: number) {
  const response = await request.get(`/designer/school/${id}`);

  // 转换状态字段格式
  if (response.data) {
    response.data = transformSchoolData(response.data);
  }

  return response;
}

/**
 * 更新院校状态
 */
export async function updateSchoolStatus(id: number, status: 'ACTIVE' | 'INACTIVE') {
  const backendStatus = convertFrontendStatusToBackend(status);
  return request.put(`/designer/school/${id}/status`, { status: backendStatus });
}
```

### 方案三：组件内转换

在Vue组件中直接处理转换：

```vue
<!-- SchoolList.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getStatusText } from '@/utils/statusConverter'

const schoolList = ref([])

function getStatusTagType(status: string) {
  return status === '0' ? 'success' : 'danger'
}

function handleStatusChange(school: any) {
  // 处理状态变更
  updateSchoolStatus(school.id, school.status)
}

// 组件挂载时获取数据
onMounted(async () => {
  const response = await getSchoolList()
  schoolList.value = response.data.rows
})
</script>

<template>
  <div>
    <el-table :data="schoolList">
      <el-table-column prop="schoolName" label="院校名称" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

## 📋 实施检查清单

### 🔧 代码修改清单

- [ ] 创建 `statusConverter.ts` 工具函数
- [ ] 修改院校API调用，添加状态字段转换
- [ ] 更新院校列表组件的状态显示逻辑
- [ ] 更新院校详情组件的状态显示逻辑
- [ ] 更新院校编辑表单的状态字段处理
- [ ] 修改筛选组件中的状态选项

### 🧪 测试验证清单

- [ ] 验证院校列表页面状态显示正确
- [ ] 验证院校详情页面状态显示正确
- [ ] 验证状态筛选功能正常
- [ ] 验证状态切换功能正常
- [ ] 验证新增/编辑院校时状态保存正确

## 💡 最佳实践建议

### 1. 统一使用工具函数
```typescript
// ✅ 推荐：使用工具函数
const displayText = getStatusText(school.status);

// ❌ 避免：直接判断
const displayText = school.status === '0' ? '启用' : '停用';
```

### 2. 类型安全
```typescript
// ✅ 推荐：使用枚举类型
status: SchoolStatus.ACTIVE

// ❌ 避免：使用魔法字符串
status: 'ACTIVE'
```

### 3. 向后兼容
```typescript
// ✅ 推荐：支持两种格式
function getStatusText(status: string): string {
  // 同时支持 '0'/'1' 和 'ACTIVE'/'INACTIVE'
  const normalizedStatus = status === '0' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  return normalizedStatus === 'ACTIVE' ? '启用' : '停用';
}
```

## 🚀 快速迁移步骤

1. **第一步**：创建工具函数文件 `utils/statusConverter.ts`
2. **第二步**：修改API层，添加数据转换逻辑
3. **第三步**：更新组件中的状态显示逻辑
4. **第四步**：测试验证功能正常

## ⚠️ 注意事项

- **数据一致性**：确保前后端状态值映射正确
- **向后兼容**：支持渐进式迁移，新旧格式并存
- **错误处理**：添加无效状态值的处理逻辑
- **测试覆盖**：充分测试各种状态转换场景

---

*文档版本：v1.0*
  *创建日期：2025年1月*
  *最后更新：2025年1月*
