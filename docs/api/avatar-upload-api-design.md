# 头像上传专用API设计方案

## 1. 概述

### 1.1 背景
当前系统使用通用的OSS上传接口，虽然能满足基本需求，但缺乏针对头像上传的专门优化。专用API可以提供更好的用户体验、安全性和管理功能。

### 1.2 目标
- 提供专门的头像上传和管理服务
- 增强安全性和文件管理
- 支持多种图片处理功能
- 提供更好的错误处理和用户反馈

## 2. API设计

### 2.1 核心接口

#### 2.1.1 上传头像
```http
POST /api/avatar/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Parameters:
- file: File (必填) - 头像文件
- compress: boolean (可选) - 是否压缩，默认true
- size: string (可选) - 目标尺寸 "small|medium|large|original"，默认medium
```

**响应示例:**
```json
{
  "code": 200,
  "msg": "上传成功",
  "data": {
    "id": "avatar_123456789",
    "originalUrl": "https://cdn.example.com/avatars/original/123456789.jpg",
    "urls": {
      "small": "https://cdn.example.com/avatars/small/123456789.jpg",
      "medium": "https://cdn.example.com/avatars/medium/123456789.jpg",
      "large": "https://cdn.example.com/avatars/large/123456789.jpg"
    },
    "metadata": {
      "filename": "avatar.jpg",
      "size": 245760,
      "width": 800,
      "height": 800,
      "format": "jpeg"
    },
    "uploadTime": "2024-01-15T10:30:00Z"
  }
}
```

#### 2.1.2 获取头像信息
```http
GET /api/avatar/{avatarId}
Authorization: Bearer {token}
```

#### 2.1.3 删除头像
```http
DELETE /api/avatar/{avatarId}
Authorization: Bearer {token}
```

#### 2.1.4 获取用户头像历史
```http
GET /api/avatar/history
Authorization: Bearer {token}

Parameters:
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认10
```

#### 2.1.5 设置默认头像
```http
PUT /api/avatar/default/{avatarId}
Authorization: Bearer {token}
```

### 2.2 数据库设计

#### 2.2.1 头像表 (avatar)
```sql
CREATE TABLE avatar (
    id VARCHAR(64) PRIMARY KEY COMMENT '头像ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    user_type ENUM('designer', 'enterprise', 'school') NOT NULL COMMENT '用户类型',
    original_filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
    original_url VARCHAR(500) NOT NULL COMMENT '原图URL',
    small_url VARCHAR(500) COMMENT '小尺寸URL (100x100)',
    medium_url VARCHAR(500) COMMENT '中尺寸URL (300x300)',
    large_url VARCHAR(500) COMMENT '大尺寸URL (800x800)',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    width INT NOT NULL COMMENT '图片宽度',
    height INT NOT NULL COMMENT '图片高度',
    format VARCHAR(10) NOT NULL COMMENT '图片格式',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否为默认头像',
    status ENUM('uploading', 'processing', 'completed', 'failed', 'deleted') DEFAULT 'uploading' COMMENT '处理状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_user_default (user_id, is_default),
    INDEX idx_created_at (created_at)
) COMMENT '头像表';
```

#### 2.2.2 头像处理任务表 (avatar_processing_task)
```sql
CREATE TABLE avatar_processing_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    avatar_id VARCHAR(64) NOT NULL COMMENT '头像ID',
    task_type ENUM('compress', 'resize', 'format_convert') NOT NULL COMMENT '任务类型',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT '任务状态',
    params JSON COMMENT '任务参数',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_avatar_id (avatar_id),
    INDEX idx_status (status)
) COMMENT '头像处理任务表';
```

## 3. 后端实现

### 3.1 Spring Boot 控制器

```java
@RestController
@RequestMapping("/api/avatar")
@Validated
public class AvatarController {

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<AvatarInfo>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "compress", defaultValue = "true") Boolean compress,
            @RequestParam(value = "size", defaultValue = "medium") String size,
            HttpServletRequest request) {

        // 获取当前用户信息
        UserInfo userInfo = getCurrentUser(request);

        // 验证文件
        validateFile(file);

        // 上传处理
        AvatarInfo avatarInfo = avatarService.uploadAvatar(userInfo, file, compress, size);

        return ResponseEntity.ok(ApiResponse.success(avatarInfo));
    }

    @GetMapping("/{avatarId}")
    public ResponseEntity<ApiResponse<AvatarInfo>> getAvatar(
            @PathVariable String avatarId,
            HttpServletRequest request) {

        UserInfo userInfo = getCurrentUser(request);
        AvatarInfo avatarInfo = avatarService.getAvatar(avatarId, userInfo);

        return ResponseEntity.ok(ApiResponse.success(avatarInfo));
    }

    @DeleteMapping("/{avatarId}")
    public ResponseEntity<ApiResponse<Void>> deleteAvatar(
            @PathVariable String avatarId,
            HttpServletRequest request) {

        UserInfo userInfo = getCurrentUser(request);
        avatarService.deleteAvatar(avatarId, userInfo);

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PageResult<AvatarInfo>>> getAvatarHistory(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            HttpServletRequest request) {

        UserInfo userInfo = getCurrentUser(request);
        PageResult<AvatarInfo> result = avatarService.getAvatarHistory(userInfo, page, limit);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/default/{avatarId}")
    public ResponseEntity<ApiResponse<Void>> setDefaultAvatar(
            @PathVariable String avatarId,
            HttpServletRequest request) {

        UserInfo userInfo = getCurrentUser(request);
        avatarService.setDefaultAvatar(avatarId, userInfo);

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private void validateFile(MultipartFile file) {
        // 文件大小限制 (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException("文件大小不能超过5MB");
        }

        // 文件类型限制
        String contentType = file.getContentType();
        if (!Arrays.asList("image/jpeg", "image/jpg", "image/png", "image/webp")
                .contains(contentType)) {
            throw new BusinessException("只支持 JPG、PNG、WebP 格式");
        }

        // 文件名安全检查
        String filename = file.getOriginalFilename();
        if (StringUtils.isBlank(filename) || filename.contains("..")) {
            throw new BusinessException("文件名不合法");
        }
    }
}
```

### 3.2 服务层实现

```java
@Service
@Transactional
public class AvatarServiceImpl implements AvatarService {

    @Autowired
    private AvatarRepository avatarRepository;

    @Autowired
    private OssService ossService;

    @Autowired
    private ImageProcessingService imageProcessingService;

    @Override
    public AvatarInfo uploadAvatar(UserInfo userInfo, MultipartFile file, Boolean compress, String size) {
        try {
            // 生成头像ID
            String avatarId = generateAvatarId();

            // 读取图片信息
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new BusinessException("无效的图片文件");
            }

            // 创建头像记录
            Avatar avatar = new Avatar();
            avatar.setId(avatarId);
            avatar.setUserId(userInfo.getId());
            avatar.setUserType(userInfo.getType());
            avatar.setOriginalFilename(file.getOriginalFilename());
            avatar.setFileSize(file.getSize());
            avatar.setWidth(image.getWidth());
            avatar.setHeight(image.getHeight());
            avatar.setFormat(getImageFormat(file));
            avatar.setStatus(AvatarStatus.UPLOADING);

            avatarRepository.save(avatar);

            // 异步处理图片
            CompletableFuture.runAsync(() -> {
                processAvatarAsync(avatar, file, compress);
            });

            // 返回初始信息
            return convertToAvatarInfo(avatar);

        } catch (IOException e) {
            throw new BusinessException("图片处理失败", e);
        }
    }

    private void processAvatarAsync(Avatar avatar, MultipartFile file, Boolean compress) {
        try {
            avatar.setStatus(AvatarStatus.PROCESSING);
            avatarRepository.save(avatar);

            // 上传原图
            String originalUrl = ossService.uploadFile(
                file.getInputStream(),
                "avatars/original/" + avatar.getId() + "." + avatar.getFormat()
            );
            avatar.setOriginalUrl(originalUrl);

            // 生成不同尺寸
            Map<String, String> urls = generateMultipleSizes(file, avatar.getId(), compress);
            avatar.setSmallUrl(urls.get("small"));
            avatar.setMediumUrl(urls.get("medium"));
            avatar.setLargeUrl(urls.get("large"));

            avatar.setStatus(AvatarStatus.COMPLETED);
            avatarRepository.save(avatar);

            // 更新用户头像
            updateUserAvatar(avatar);

        } catch (Exception e) {
            avatar.setStatus(AvatarStatus.FAILED);
            avatarRepository.save(avatar);
            log.error("头像处理失败: {}", avatar.getId(), e);
        }
    }

    private Map<String, String> generateMultipleSizes(MultipartFile file, String avatarId, Boolean compress) throws IOException {
        Map<String, String> urls = new HashMap<>();

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 小尺寸 100x100
        BufferedImage smallImage = imageProcessingService.resizeImage(originalImage, 100, 100, compress);
        String smallUrl = uploadProcessedImage(smallImage, "avatars/small/" + avatarId + ".jpg");
        urls.put("small", smallUrl);

        // 中尺寸 300x300
        BufferedImage mediumImage = imageProcessingService.resizeImage(originalImage, 300, 300, compress);
        String mediumUrl = uploadProcessedImage(mediumImage, "avatars/medium/" + avatarId + ".jpg");
        urls.put("medium", mediumUrl);

        // 大尺寸 800x800
        BufferedImage largeImage = imageProcessingService.resizeImage(originalImage, 800, 800, compress);
        String largeUrl = uploadProcessedImage(largeImage, "avatars/large/" + avatarId + ".jpg");
        urls.put("large", largeUrl);

        return urls;
    }
}
```

### 3.3 图片处理服务

```java
@Service
public class ImageProcessingServiceImpl implements ImageProcessingService {

    @Override
    public BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight, boolean compress) {
        // 计算等比缩放尺寸
        Dimension targetSize = calculateTargetSize(originalImage, targetWidth, targetHeight);

        // 使用高质量缩放算法
        BufferedImage resizedImage = new BufferedImage(
            targetSize.width,
            targetSize.height,
            BufferedImage.TYPE_INT_RGB
        );

        Graphics2D g2d = resizedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.drawImage(originalImage, 0, 0, targetSize.width, targetSize.height, null);
        g2d.dispose();

        return resizedImage;
    }

    @Override
    public BufferedImage cropToSquare(BufferedImage originalImage) {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        int size = Math.min(width, height);

        int x = (width - size) / 2;
        int y = (height - size) / 2;

        return originalImage.getSubimage(x, y, size, size);
    }

    private Dimension calculateTargetSize(BufferedImage image, int maxWidth, int maxHeight) {
        int originalWidth = image.getWidth();
        int originalHeight = image.getHeight();

        double widthRatio = (double) maxWidth / originalWidth;
        double heightRatio = (double) maxHeight / originalHeight;
        double ratio = Math.min(widthRatio, heightRatio);

        int targetWidth = (int) (originalWidth * ratio);
        int targetHeight = (int) (originalHeight * ratio);

        return new Dimension(targetWidth, targetHeight);
    }
}
```

## 4. 前端集成

### 4.1 API接口封装

```typescript
// src/api/talent/avatar.ts
import request from '@/utils/request'

export interface AvatarInfo {
  id: string
  originalUrl: string
  urls: {
    small: string
    medium: string
    large: string
  }
  metadata: {
    filename: string
    size: number
    width: number
    height: number
    format: string
  }
  uploadTime: string
}

export interface AvatarUploadOptions {
  compress?: boolean
  size?: 'small' | 'medium' | 'large' | 'original'
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File, options: AvatarUploadOptions = {}): Promise<AvatarInfo> {
  const formData = new FormData()
  formData.append('file', file)

  if (options.compress !== undefined) {
    formData.append('compress', String(options.compress))
  }

  if (options.size) {
    formData.append('size', options.size)
  }

  return request.post('/api/avatar/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 1分钟超时
  })
}

/**
 * 获取头像信息
 */
export function getAvatar(avatarId: string): Promise<AvatarInfo> {
  return request.get(`/api/avatar/${avatarId}`)
}

/**
 * 删除头像
 */
export function deleteAvatar(avatarId: string): Promise<void> {
  return request.delete(`/api/avatar/${avatarId}`)
}

/**
 * 获取头像历史
 */
export function getAvatarHistory(page = 1, limit = 10) {
  return request.get('/api/avatar/history', {
    params: { page, limit }
  })
}

/**
 * 设置默认头像
 */
export function setDefaultAvatar(avatarId: string): Promise<void> {
  return request.put(`/api/avatar/default/${avatarId}`)
}
```

### 4.2 增强的头像上传组件

```vue
<!-- src/components/common/AvatarUpload/index.vue (增强版) -->
<template>
  <div class="avatar-upload-container">
    <!-- 头像预览和选择 -->
    <div class="flex items-center">
      <div class="avatar-preview-container relative">
        <div
          class="w-16 h-16 rounded-full overflow-hidden bg-gray-800 avatar-preview flex items-center justify-center cursor-pointer relative"
          :style="avatarStyle"
          @click="triggerUpload"
        >
          <i v-if="!currentAvatar" class="ri-camera-line text-2xl text-gray-400" />

          <!-- 上传中遮罩 -->
          <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <i class="ri-loader-4-line text-xl text-white animate-spin" />
          </div>

          <!-- 悬停遮罩 -->
          <div class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <i class="ri-camera-line text-lg text-white" />
          </div>
        </div>

        <!-- 删除按钮 -->
        <button
          v-if="currentAvatar && !uploading"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
          @click="handleDelete"
        >
          <i class="ri-close-line" />
        </button>
      </div>

      <!-- 上传按钮 -->
      <div class="ml-4 space-y-2">
        <button
          type="button"
          class="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap"
          :disabled="uploading"
          @click="triggerUpload"
        >
          {{ uploading ? '上传中...' : (currentAvatar ? '更换头像' : '选择头像') }}
        </button>

        <!-- 历史头像按钮 -->
        <button
          v-if="showHistory"
          type="button"
          class="px-3 py-1 text-xs bg-blue-500/20 border border-blue-500/50 rounded text-blue-400 hover:bg-blue-500/30 transition-colors"
          @click="showHistoryModal = true"
        >
          历史头像
        </button>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      style="display: none"
      @change="handleFileSelect"
    >

    <!-- 上传进度 -->
    <div v-if="uploading" class="mt-3">
      <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>{{ uploadStatus }}</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <p v-if="error" class="text-red-400 text-xs mt-2">{{ error }}</p>

    <!-- 提示信息 -->
    <p class="text-gray-500 text-xs mt-2">
      支持 JPG、PNG、WebP 格式，文件大小不超过 {{ maxSizeMB }}MB
    </p>

    <!-- 头像历史模态框 -->
    <AvatarHistoryModal
      v-model:visible="showHistoryModal"
      @select="handleSelectFromHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { uploadAvatar, deleteAvatar, type AvatarInfo } from '@/api/talent/avatar'
import AvatarHistoryModal from './AvatarHistoryModal.vue'

interface Props {
  modelValue?: string
  maxSizeMB?: number
  quality?: number
  showHistory?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'success', avatarInfo: AvatarInfo): void
  (e: 'error', error: string): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  maxSizeMB: 5,
  quality: 0.8,
  showHistory: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

// 状态管理
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('')
const error = ref('')
const currentAvatar = ref<AvatarInfo>()
const showHistoryModal = ref(false)

// 计算属性
const avatarStyle = computed(() => {
  const avatarUrl = currentAvatar.value?.urls?.[props.size] || props.modelValue
  if (avatarUrl) {
    return {
      backgroundImage: `url(${avatarUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

// 监听外部头像变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && !currentAvatar.value) {
    // 如果有外部传入的头像URL但没有头像信息，可以在这里加载头像信息
  }
})

// 触发文件选择
const triggerUpload = () => {
  if (uploading.value) return
  error.value = ''
  fileInput.value?.click()
}

// 文件选择处理
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!validateFile(file)) {
    target.value = ''
    return
  }

  uploadFile(file)
  target.value = ''
}

// 文件验证
const validateFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = '请选择 JPG、PNG 或 WebP 格式的图片'
    return false
  }

  const maxSize = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    error.value = `文件大小不能超过 ${props.maxSizeMB}MB`
    return false
  }

  return true
}

// 上传文件
const uploadFile = async (file: File) => {
  try {
    uploading.value = true
    uploadProgress.value = 0
    uploadStatus.value = '准备上传...'
    error.value = ''

    const avatarInfo = await uploadAvatar(file, {
      compress: true,
      size: props.size
    })

    currentAvatar.value = avatarInfo
    emit('update:modelValue', avatarInfo.urls[props.size])
    emit('success', avatarInfo)

    uploadStatus.value = '上传完成'

  } catch (err: any) {
    const errorMsg = err.response?.data?.msg || err.message || '上传失败，请重试'
    error.value = errorMsg
    emit('error', errorMsg)
    console.error('头像上传失败:', err)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    uploadStatus.value = ''
  }
}

// 删除头像
const handleDelete = async () => {
  if (!currentAvatar.value) return

  try {
    await deleteAvatar(currentAvatar.value.id)
    currentAvatar.value = undefined
    emit('update:modelValue', '')
    emit('delete')
  } catch (err: any) {
    error.value = err.response?.data?.msg || '删除失败'
  }
}

// 从历史中选择头像
const handleSelectFromHistory = (avatarInfo: AvatarInfo) => {
  currentAvatar.value = avatarInfo
  emit('update:modelValue', avatarInfo.urls[props.size])
  emit('success', avatarInfo)
  showHistoryModal.value = false
}
</script>

<style scoped>
.avatar-preview {
  position: relative;
  border: 1px solid rgba(99, 99, 102, 0.2);
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  border-color: rgba(10, 132, 255, 0.5);
}

.rounded-button {
  border-radius: 8px;
}
</style>
```

## 5. 安全和性能考虑

### 5.1 安全措施
- **文件类型验证**: 严格限制允许的图片格式
- **文件大小限制**: 防止大文件攻击
- **文件内容检查**: 验证文件确实是图片格式
- **用户权限验证**: 确保用户只能管理自己的头像
- **防重放攻击**: 使用一次性令牌或时间戳验证

### 5.2 性能优化
- **异步处理**: 图片处理在后台异步进行
- **CDN分发**: 使用CDN加速图片访问
- **多尺寸生成**: 预生成多种尺寸避免实时缩放
- **缓存策略**: 设置合适的缓存头
- **压缩优化**: 智能压缩减少存储和传输成本

### 5.3 监控和日志
- **上传统计**: 记录上传成功率、耗时等指标
- **错误监控**: 监控上传失败原因和频率
- **存储监控**: 监控存储使用量和成本
- **性能监控**: 监控图片处理和上传的性能指标

## 6. 部署和运维

### 6.1 配置管理
```yaml
# application.yml
avatar:
  upload:
    max-file-size: 5MB
    allowed-types: [image/jpeg, image/png, image/webp]
    sizes:
      small: 100x100
      medium: 300x300
      large: 800x800
    compress:
      quality: 0.8
      enabled: true
  storage:
    type: oss # oss, s3, local
    bucket: avatars
    path-prefix: /avatars/
  processing:
    async: true
    thread-pool-size: 5
```

### 6.2 监控指标
- 上传成功率
- 平均上传耗时
- 图片处理耗时
- 存储使用量
- CDN命中率

### 6.3 错误处理和重试机制
- 网络超时重试
- 文件损坏检测
- 存储服务异常处理
- 图片处理失败恢复

## 7. 实施计划

### 7.1 阶段一：基础API开发（1-2周）
- 设计和创建数据库表
- 实现基础的上传、获取、删除接口
- 基础文件验证和安全检查
- 单元测试和集成测试

### 7.2 阶段二：图片处理功能（1周）
- 实现图片压缩和多尺寸生成
- 异步处理机制
- 任务状态跟踪
- 性能优化

### 7.3 阶段三：前端集成（1周）
- 更新前端API接口
- 增强头像上传组件
- 头像历史功能
- 用户体验优化

### 7.4 阶段四：监控和运维（0.5周）
- 添加监控指标
- 日志完善
- 性能调优
- 文档完善

## 8. 风险评估

### 8.1 技术风险
- **存储服务依赖**: OSS服务不可用风险
- **图片处理性能**: 大量并发上传可能导致性能瓶颈
- **数据库性能**: 头像历史查询可能影响数据库性能

### 8.2 业务风险
- **用户数据迁移**: 现有头像数据需要平滑迁移
- **兼容性问题**: 新老接口需要保持兼容
- **存储成本**: 多尺寸存储增加成本

### 8.3 缓解措施
- 实现熔断和降级机制
- 使用队列控制并发处理
- 添加缓存层减少数据库压力
- 制定详细的迁移方案
- 监控存储使用情况

---

**文档版本**: 1.0
**创建时间**: 2024-01-15
**更新时间**: 2024-01-15
**维护人员**: 开发团队
