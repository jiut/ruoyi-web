import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import {
  getCurrentRole,
  hasProfessionalRole,
  isNormalRole,
  needsRoleSelection,
} from '@/utils/authUtils'

export function useRoleCheck() {
  const router = useRouter()
  const userStore = useUserStore()

  const isLoading = ref(true)
  const currentRole = ref(getCurrentRole())
  const needsSelection = ref(false)

  // 计算属性
  const isNormalUser = computed(() => isNormalRole())
  const hasProfessional = computed(() => hasProfessionalRole())
  const shouldSelectRole = computed(() => needsRoleSelection())

  // 检查角色状态
  const checkRoleStatus = async () => {
    try {
      isLoading.value = true

      // 刷新用户信息
      await userStore.fetchUserInfo()

      // 更新状态
      currentRole.value = getCurrentRole()
      needsSelection.value = needsRoleSelection()
    }
    catch (error) {
      console.error('检查角色状态失败:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  // 跳转到角色选择页面
  const goToRoleSelection = () => {
    router.push('/role-selection')
  }

  // 跳转到首页
  const goToHome = () => {
    router.push('/')
  }

  // 跳转到人才模块
  const goToTalent = () => {
    router.push('/talent')
  }

  // 获取角色显示名称
  const getRoleDisplayName = () => {
    if (!currentRole.value)
      return '未知'

    const roleMap: Record<string, string> = {
      '1932319128081666050': '设计师',
      '1932319128081666051': '企业管理员',
      '1932319128081666052': '院校管理员',
      '2': '普通用户',
    }

    return roleMap[currentRole.value.roleId] || currentRole.value.roleName || '未知'
  }

  // 检查是否为特定角色
  const isRole = (roleId: string) => {
    return currentRole.value?.roleId === roleId
  }

  // 检查是否为设计师
  const isDesigner = computed(() => isRole('1932319128081666050'))

  // 检查是否为企业管理员
  const isEnterprise = computed(() => isRole('1932319128081666051'))

  // 检查是否为院校管理员
  const isSchool = computed(() => isRole('1932319128081666052'))

  onMounted(() => {
    checkRoleStatus()
  })

  return {
    // 状态
    isLoading,
    currentRole,
    needsSelection,

    // 计算属性
    isNormalUser,
    hasProfessional,
    shouldSelectRole,
    isDesigner,
    isEnterprise,
    isSchool,

    // 方法
    checkRoleStatus,
    goToRoleSelection,
    goToHome,
    goToTalent,
    getRoleDisplayName,
    isRole,
  }
}
