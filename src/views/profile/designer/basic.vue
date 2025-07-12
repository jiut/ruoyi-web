<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ProfileCompletenessGuide } from '@/components/common'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import SkillTagSelector from '@/components/common/SkillTagSelector/index.vue'
import {
  getCurrentDesigner,
  getDesignerComplete,
  updateDesigner,
  addEducation as apiAddEducation,
  updateEducation as apiUpdateEducation,
  deleteEducation as apiDeleteEducation,
  addWorkExperience as apiAddWorkExperience,
  updateWorkExperience as apiUpdateWorkExperience,
  deleteWorkExperience as apiDeleteWorkExperience,
  addWork as apiAddWork,
  updateWork as apiUpdateWork,
  deleteWork as apiDeleteWork,
  addAward as apiAddAward,
  updateAward as apiUpdateAward,
  deleteAward as apiDeleteAward
} from '@/api/talent/designer'
import type { Designer, Profession } from '@/types/talent/designer'
import { WorkStatus } from '@/types/talent/designer'
import type { DesignerCompleteDetail } from '@/api/talent/designer'
import SkillTagUtils from '@/utils/skillTagUtils'
import ProfessionUtils from '@/utils/professionUtils'
import { getProfileCompleteness } from '@/api/talent/registration'

const router = useRouter()

// 步骤定义
const steps = [
  { id: 'basic', title: '基础信息', description: '完善个人基本信息' },
  { id: 'education', title: '教育背景', description: '添加教育经历' },
  { id: 'award', title: '获奖记录', description: '填写获奖经历' },
  { id: 'experience', title: '工作经历', description: '添加工作经历' },
  // { id: 'portfolio', title: '作品集', description: '上传设计作品' }, // 暂时隐藏，以后开发
]

// 当前步骤
const currentStep = ref('basic')
const completedSteps = ref<string[]>([])

// 加载状态
const loading = ref(true)
const saving = ref(false)
const dataLoaded = ref(false)

// 基础信息表单
const basicForm = reactive({
  id: undefined as number | undefined,
  designerName: '',
  avatar: '',
  gender: undefined as string | undefined,
  birthDate: '',
  phone: '',
  email: '',
  location: '',
  description: '',
  workStatus: undefined as WorkStatus | undefined,
  profession: undefined as Profession | undefined,
  workYears: 0,
  portfolioUrl: '',
})

// 教育背景列表
const educationList = ref<any[]>([])

// 工作经历列表
const experienceList = ref<any[]>([])

// 作品集列表
const portfolioList = ref<any[]>([])

// 技能标签
const selectedSkillTags = ref<string[]>([])
const showSkillTagSelector = ref(false)

// 下拉菜单状态
const showGenderDropdown = ref(false)
const showJobTypeDropdown = ref(false)
const showWorkStatusDropdown = ref(false)

// 选项数据
const genderOptions = [
  { value: '0', label: '男' },
  { value: '1', label: '女' },
  { value: '2', label: '其他' },
]

const jobTypeOptions = ProfessionUtils.getSelectOptions()

const workStatusOptions = [
  { value: WorkStatus.EMPLOYED, label: '在职' },
  { value: WorkStatus.FREELANCER, label: '自由职业' },
  { value: WorkStatus.SEEKING, label: '求职中' },
  { value: WorkStatus.STUDENT, label: '学生' },
]

// 计算属性
const genderText = computed(() => {
  if (!basicForm || !basicForm.gender)
    return '请选择'
  const option = genderOptions.find(opt => opt.value === basicForm.gender)
  return option ? option.label : '请选择'
})

const jobTypeText = computed(() => {
  if (!basicForm || !basicForm.profession)
    return '请选择您的职业类型'
  const option = jobTypeOptions.find(opt => opt.value === basicForm.profession)
  return option ? option.label : '请选择您的职业类型'
})

const workStatusText = computed(() => {
  if (!basicForm || !basicForm.workStatus)
    return '请选择工作状态'
  const option = workStatusOptions.find(opt => opt.value === basicForm.workStatus)
  return option ? option.label : '请选择工作状态'
})

const avatarStyle = computed(() => {
  if (basicForm && basicForm.avatar) {
    return {
      backgroundImage: `url(${basicForm.avatar})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

const sortedSelectedTags = computed(() => {
  return SkillTagUtils.sortTagsByCategory(selectedSkillTags.value)
})

const selectedTagsByCategory = computed(() => {
  return SkillTagUtils.groupAndSortTagsByCategory(selectedSkillTags.value)
})

const profileCompleteness = ref(null)

const fetchProfileCompleteness = async () => {
  try {
    const res = await getProfileCompleteness()
    if (res && res.data) {
      profileCompleteness.value = res.data
    }
  } catch (e) {
    console.error('获取档案完整度失败', e)
  }
}

// 步骤导航
const nextStep = async () => {
  // 如果是基础信息步骤，使用HTML5原生验证
  if (currentStep.value === 'basic') {
    // 使用ref获取表单元素
    const form = document.querySelector('form[novalidate]') as HTMLFormElement
    if (form && !form.checkValidity()) {
      // 显示浏览器错误气泡
      form.reportValidity()
      return
    }
  }

  // 教育背景步骤验证
  if (currentStep.value === 'education') {
    // 验证已添加的教育背景是否完整
    const incompleteEducations = educationList.value.filter(edu =>
      !edu.school || !edu.major || !edu.degree || !edu.startDate
    )
    if (incompleteEducations.length > 0) {
      alert('请完善所有教育背景的必填信息（学校名称、专业、学历、开始时间）')
      return
    }
    // GPA校验，超限时用原生气泡提示
    const gpaInputs = document.querySelectorAll('input[type="number"][max="5"]')
    for (let i = 0; i < gpaInputs.length; i++) {
      const input = gpaInputs[i] as HTMLInputElement
      if (input.value && Number(input.value) > 5) {
        input.focus()
        input.reportValidity()
        return
      }
    }
    // 结束时间不能早于开始时间校验（教育背景）
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (edu.startDate && edu.endDate) {
        const start = new Date(edu.startDate)
        const end = new Date(edu.endDate)
        if (end < start) {
          const endInput = document.querySelector(`input[data-enddate-index='${idx}']`) as HTMLInputElement
          if (endInput) {
            endInput.focus()
            endInput.setCustomValidity('结束时间不能早于开始时间')
            setTimeout(() => {
              endInput.reportValidity()
            }, 10)
            setTimeout(() => endInput.setCustomValidity(''), 3000)
          }
          return
        }
      }
    }
    // 年级排名必须大于0校验
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (
        edu.ranking !== undefined &&
        edu.ranking !== null &&
        edu.ranking !== '' &&
        Number(edu.ranking) <= 0
      ) {
        const rankingInput = document.querySelector(`input[data-ranking-index='${idx}']`) as HTMLInputElement
        if (rankingInput) {
          rankingInput.focus()
          rankingInput.setCustomValidity('年级排名必须大于0')
          rankingInput.reportValidity()
          setTimeout(() => rankingInput.setCustomValidity(''), 1000)
        }
        return
      }
    }
    // 年级排名不能大于年级总人数校验
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (
        edu.ranking && edu.totalStudents &&
        Number(edu.ranking) > Number(edu.totalStudents)
      ) {
        // 选取带有 data-ranking-index 的 input
        const rankingInput = document.querySelector(`input[data-ranking-index='${idx}']`) as HTMLInputElement
        if (rankingInput) {
          rankingInput.focus()
          rankingInput.setCustomValidity('年级排名不能大于年级总人数')
          rankingInput.reportValidity()
          setTimeout(() => rankingInput.setCustomValidity(''), 1000)
        }
        return
      }
    }
  }

  // 工作经历步骤验证
  if (currentStep.value === 'experience') {
    // 验证已添加的工作经历是否完整
    const incompleteExperiences = experienceList.value.filter(exp =>
      !exp.company || !exp.position || !exp.startDate
    )
    if (incompleteExperiences.length > 0) {
      alert('请完善所有工作经历的必填信息（公司名称、职位名称、入职时间）')
      return
    }
    // 结束时间不能早于开始时间校验（工作经历）
    for (let idx = 0; idx < experienceList.value.length; idx++) {
      const exp = experienceList.value[idx]
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate)
        const end = new Date(exp.endDate)
        if (end < start) {
          const endInput = document.querySelector(`input[data-exp-enddate-index='${idx}']`) as HTMLInputElement
          if (endInput) {
            endInput.focus()
            endInput.setCustomValidity('离职时间不能早于入职时间')
            setTimeout(() => {
              endInput.reportValidity()
            }, 10)
            setTimeout(() => endInput.setCustomValidity(''), 3000)
          }
          return
        }
      }
    }
  }

  // 获奖记录步骤验证
  if (currentStep.value === 'award') {
    // 校验已添加的获奖记录是否完整
    for (let idx = 0; idx < awardList.value.length; idx++) {
      const award = awardList.value[idx]
      // 奖项名称
      if (!award.title) {
        const input = document.querySelector(`input[data-award-title-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('奖项名称为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      // 颁发机构
      if (!award.organization) {
        const input = document.querySelector(`input[data-award-org-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('颁发机构为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      // 获奖年份
      if (!award.year) {
        const input = document.querySelector(`input[data-award-year-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('获奖年份为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      if (isNaN(Number(award.year)) || Number(award.year) < 1900 || Number(award.year) > 2100) {
        const input = document.querySelector(`input[data-award-year-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('年份必须为1900-2100之间的数字')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
    }
  }

    try {
    // 保存当前步骤的数据，返回是否有变更
    const changed = await saveCurrentStep()

    // 只有有变更时才刷新完整度
    if (changed) {
      await fetchProfileCompleteness()
    }
  }
  catch (error) {
    console.error('nextStep: 保存数据失败:', error)

    // 输出更详细的错误信息
    if (error && typeof error === 'object') {
      console.error('nextStep: 错误详情:', {
        name: (error as any).name,
        message: (error as any).message,
        stack: (error as any).stack,
        response: (error as any).response,
        data: (error as any).data,
        ...error
      })
    }

    // 根据错误类型显示不同的提示信息
    let errorMessage = '保存数据失败，请检查网络连接后重试'
    if (error && typeof error === 'object') {
      const errorObj = error as any
      if (errorObj.message) {
        errorMessage = `保存失败: ${errorObj.message}`
      } else if (errorObj.data && errorObj.data.message) {
        errorMessage = `保存失败: ${errorObj.data.message}`
      }
    }

    alert(errorMessage)
    return
  }

  // 保存成功后执行步骤切换
  const currentIndex = steps.findIndex(step => step.id === currentStep.value)
  if (currentIndex < steps.length - 1) {
    if (!completedSteps.value.includes(currentStep.value))
      completedSteps.value.push(currentStep.value)

    currentStep.value = steps[currentIndex + 1].id
  }
}

// 处理基础信息表单提交（用于HTML5验证）
const handleBasicFormSubmit = async () => {
  await nextStep()
}

const previousStep = () => {
  try {
    const currentIndex = steps.findIndex(step => step.id === currentStep.value)
    if (currentIndex > 0)
      currentStep.value = steps[currentIndex - 1].id
  } catch (error) {
    console.error('切换步骤失败:', error)
  }
}

// 教育背景操作
const addEducation = () => {
  const item: any = {
    id: `new_${Date.now()}`,
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    gpa: undefined,
    ranking: undefined,
    totalStudents: undefined,
    _saved: false,
    _original: undefined as any,
  }
  item._original = JSON.parse(JSON.stringify(item)) as typeof item
  educationList.value.push(item)
}

const removeEducation = async (id: string) => {
  const index = educationList.value.findIndex(item => item.id.toString() === id.toString())
  if (index === -1) return

  const education = educationList.value[index]

    // 确认删除
  const schoolName = education.school || '未命名学校'
  if (!confirm(`确定要删除教育经历"${schoolName}"吗？删除后无法恢复。`)) {
    return
  }

  console.log('准备删除教育背景:', { id, school: education.school, isNewRecord: id.toString().startsWith('new_') })

  try {
    // 如果是已保存到服务器的记录，需要调用删除API
    if (!id.toString().startsWith('new_')) {
      console.log('删除服务器上的教育背景:', id)
      await apiDeleteEducation(id.toString()) // 确保使用字符串ID，避免精度丢失
      console.log('教育背景删除成功')
    } else {
      console.log('删除本地未保存的教育背景:', education.school)
    }

    // 从本地数组中移除
    educationList.value.splice(index, 1)
  } catch (error) {
    console.error('删除教育背景失败:', error)
    alert(`删除教育背景"${education.school}"失败，请重试`)
  }
}

// 工作经历操作
const addExperience = () => {
  const item: any = {
    id: `new_${Date.now()}`,
    company: '',
    position: '',
    location: '',
    industry: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    _saved: false,
    _original: undefined as any,
  }
  item._original = JSON.parse(JSON.stringify(item)) as typeof item
  experienceList.value.push(item)
}

const removeExperience = async (id: string) => {
  const index = experienceList.value.findIndex(item => item.id.toString() === id.toString())
  if (index === -1) return

  const experience = experienceList.value[index]

  // 确认删除
  const companyName = experience.company || '未命名公司'
  if (!confirm(`确定要删除工作经历"${companyName}"吗？删除后无法恢复。`)) {
    return
  }

  try {
    // 如果是已保存到服务器的记录，需要调用删除API
    if (!id.toString().startsWith('new_')) {
      console.log('删除服务器上的工作经历:', id)
      await apiDeleteWorkExperience(id.toString()) // 确保使用字符串ID，避免精度丢失
      console.log('工作经历删除成功')
    } else {
      console.log('删除本地未保存的工作经历:', experience.company)
    }

    // 从本地数组中移除
    experienceList.value.splice(index, 1)
  } catch (error) {
    console.error('删除工作经历失败:', error)
    alert(`删除工作经历"${experience.company}"失败，请重试`)
  }
}

// 作品集操作
const addPortfolio = () => {
  // 这里应该打开文件选择器
  portfolioList.value.push({
    id: `new_${Date.now()}`, // 使用前缀标识新增记录
    title: '新作品',
    description: '',
    workType: 'image',
    fileUrl: '',
    thumbnailUrl: '',
    tags: [],
    isFeatured: false,
    _saved: false, // 添加保存状态标记
  })
}

const removePortfolio = async (id: string) => {
  const index = portfolioList.value.findIndex(item => item.id.toString() === id.toString())
  if (index === -1) return

  const portfolio = portfolioList.value[index]

  // 确认删除
  const workTitle = portfolio.title || '未命名作品'
  if (!confirm(`确定要删除作品"${workTitle}"吗？删除后无法恢复。`)) {
    return
  }

  try {
    // 如果是已保存到服务器的记录，需要调用删除API
    if (!id.toString().startsWith('new_')) {
      console.log('删除服务器上的作品:', id)
      await apiDeleteWork(id.toString()) // 确保使用字符串ID，避免精度丢失
      console.log('作品删除成功')
    } else {
      console.log('删除本地未保存的作品:', portfolio.title)
    }

    // 从本地数组中移除
    portfolioList.value.splice(index, 1)
  } catch (error) {
    console.error('删除作品失败:', error)
    alert(`删除作品"${portfolio.title}"失败，请重试`)
  }
}

// 技能标签操作
const removeSkillTag = (tag: string) => {
  const index = selectedSkillTags.value.indexOf(tag)
  if (index > -1)
    selectedSkillTags.value.splice(index, 1)
}

const handleSkillTagConfirm = (tags: string[]) => {
  if (tags.length > 15) {
    alert('最多只能选择15个技能标签')
    return
  }
  selectedSkillTags.value = [...tags]
}

// 保存和完成
const saveAndExit = async () => {
  try {
    // 保存当前进度
    await saveCurrentStep()
    console.log('数据保存成功')
    // 退出到人才模块
    router.push('/talent')
  }
  catch (error) {
    console.error('保存失败:', error)
    // 这里可以添加错误提示
  }
}

const finishProfile = async () => {
  // 先进行当前步骤的验证，复用nextStep的验证逻辑
  if (currentStep.value === 'basic') {
    // 使用HTML5原生验证
    const form = document.querySelector('form[novalidate]') as HTMLFormElement
    if (form && !form.checkValidity()) {
      // 显示浏览器错误气泡
      form.reportValidity()
      return
    }
  }

  // 教育背景步骤验证
  if (currentStep.value === 'education') {
    // 验证已添加的教育背景是否完整
    const incompleteEducations = educationList.value.filter(edu =>
      !edu.school || !edu.major || !edu.degree || !edu.startDate
    )
    if (incompleteEducations.length > 0) {
      alert('请完善所有教育背景的必填信息（学校名称、专业、学历、开始时间）')
      return
    }
    // GPA校验，超限时用原生气泡提示
    const gpaInputs = document.querySelectorAll('input[type="number"][max="5"]')
    for (let i = 0; i < gpaInputs.length; i++) {
      const input = gpaInputs[i] as HTMLInputElement
      if (input.value && Number(input.value) > 5) {
        input.focus()
        input.reportValidity()
        return
      }
    }
    // 结束时间不能早于开始时间校验（教育背景）
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (edu.startDate && edu.endDate) {
        const start = new Date(edu.startDate)
        const end = new Date(edu.endDate)
        if (end < start) {
          const endInput = document.querySelector(`input[data-enddate-index='${idx}']`) as HTMLInputElement
          if (endInput) {
            endInput.focus()
            endInput.setCustomValidity('结束时间不能早于开始时间')
            setTimeout(() => {
              endInput.reportValidity()
            }, 10)
            setTimeout(() => endInput.setCustomValidity(''), 3000)
          }
          return
        }
      }
    }
    // 年级排名必须大于0校验
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (
        edu.ranking !== undefined &&
        edu.ranking !== null &&
        edu.ranking !== '' &&
        Number(edu.ranking) <= 0
      ) {
        const rankingInput = document.querySelector(`input[data-ranking-index='${idx}']`) as HTMLInputElement
        if (rankingInput) {
          rankingInput.focus()
          rankingInput.setCustomValidity('年级排名必须大于0')
          rankingInput.reportValidity()
          setTimeout(() => rankingInput.setCustomValidity(''), 1000)
        }
        return
      }
    }
    // 年级排名不能大于年级总人数校验
    for (let idx = 0; idx < educationList.value.length; idx++) {
      const edu = educationList.value[idx]
      if (
        edu.ranking && edu.totalStudents &&
        Number(edu.ranking) > Number(edu.totalStudents)
      ) {
        // 选取带有 data-ranking-index 的 input
        const rankingInput = document.querySelector(`input[data-ranking-index='${idx}']`) as HTMLInputElement
        if (rankingInput) {
          rankingInput.focus()
          rankingInput.setCustomValidity('年级排名不能大于年级总人数')
          rankingInput.reportValidity()
          setTimeout(() => rankingInput.setCustomValidity(''), 1000)
        }
        return
      }
    }
  }

  // 工作经历步骤验证
  if (currentStep.value === 'experience') {
    // 验证已添加的工作经历是否完整
    const incompleteExperiences = experienceList.value.filter(exp =>
      !exp.company || !exp.position || !exp.startDate
    )
    if (incompleteExperiences.length > 0) {
      alert('请完善所有工作经历的必填信息（公司名称、职位名称、入职时间）')
      return
    }
    // 结束时间不能早于开始时间校验（工作经历）
    for (let idx = 0; idx < experienceList.value.length; idx++) {
      const exp = experienceList.value[idx]
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate)
        const end = new Date(exp.endDate)
        if (end < start) {
          const endInput = document.querySelector(`input[data-exp-enddate-index='${idx}']`) as HTMLInputElement
          if (endInput) {
            endInput.focus()
            endInput.setCustomValidity('离职时间不能早于入职时间')
            setTimeout(() => {
              endInput.reportValidity()
            }, 10)
            setTimeout(() => endInput.setCustomValidity(''), 3000)
          }
          return
        }
      }
    }
  }

  // 获奖记录步骤验证
  if (currentStep.value === 'award') {
    for (let idx = 0; idx < awardList.value.length; idx++) {
      const award = awardList.value[idx]
      if (!award.title) {
        const input = document.querySelector(`input[data-award-title-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('奖项名称为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      if (!award.organization) {
        const input = document.querySelector(`input[data-award-org-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('颁发机构为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      if (!award.year) {
        const input = document.querySelector(`input[data-award-year-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('获奖年份为必填项')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
      if (isNaN(Number(award.year)) || Number(award.year) < 1900 || Number(award.year) > 2100) {
        const input = document.querySelector(`input[data-award-year-index='${idx}']`) as HTMLInputElement
        if (input) {
          input.focus()
          input.setCustomValidity('年份必须为1900-2100之间的数字')
          setTimeout(() => input.reportValidity(), 10)
          setTimeout(() => input.setCustomValidity(''), 3000)
        }
        return
      }
    }
  }

  try {
    // 保存当前步骤的数据，返回是否有变更
    const changed = await saveCurrentStep()

    // 只有有变更时才刷新完整度
    if (changed) {
      await fetchProfileCompleteness()
    }

    // 完成所有步骤
    completedSteps.value.push(currentStep.value)
    router.push('/talent')
  }
  catch (error) {
    console.error('finishProfile: 保存数据失败:', error)

    // 输出更详细的错误信息
    if (error && typeof error === 'object') {
      console.error('finishProfile: 错误详情:', {
        name: (error as any).name,
        message: (error as any).message,
        stack: (error as any).stack,
        response: (error as any).response,
        data: (error as any).data,
        ...error
      })
    }

    // 根据错误类型显示不同的提示信息
    let errorMessage = '保存数据失败，请检查网络连接后重试'
    if (error && typeof error === 'object') {
      const errorObj = error as any
      if (errorObj.message) {
        errorMessage = `保存失败: ${errorObj.message}`
      } else if (errorObj.data && errorObj.data.message) {
        errorMessage = `保存失败: ${errorObj.data.message}`
      }
    }

    alert(errorMessage)
    return
  }
}

// 加载当前用户的设计师信息
const loadDesignerData = async () => {
  try {
    loading.value = true

    // 首先获取当前用户的设计师基础信息来获取designerId
    const currentResponse = await getCurrentDesigner()

    if (currentResponse && currentResponse.data && currentResponse.data.id) {
      const designerId = currentResponse.data.id
      console.log('获取到当前用户设计师ID:', designerId)

      // 使用聚合API一次性获取完整档案数据
      const completeResponse = await getDesignerComplete(designerId)

      if (completeResponse && completeResponse.data) {
        const completeData: DesignerCompleteDetail = completeResponse.data
        console.log('获取到完整设计师数据:', completeData)

        // 填充基础信息
        if (completeData.designer) {
          fillBasicForm(completeData.designer)
          parseSkillTags(completeData.designer.skillTags)
        }

        // 填充教育背景
        if (completeData.educations && completeData.educations.length > 0) {
          educationList.value = completeData.educations.map(edu => {
            const item: any = {
              id: ((edu as any).educationId || edu.id)?.toString() || `new_${Date.now()}`,
              school: edu.school || '',
              major: edu.major || '',
              degree: edu.degree || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || '',
              isCurrent: edu.isCurrent || false,
              description: edu.description || '',
              gpa: edu.gpa || undefined,
              ranking: edu.ranking || undefined,
              totalStudents: edu.totalStudents || undefined,
              _saved: true,
              _original: undefined as any,
            }

            // 创建标准化的原始数据快照
            const originalData = {
              ...item,
              // 标准化空值处理
              school: item.school || '',
              major: item.major || '',
              degree: item.degree || '',
              startDate: item.startDate || '',
              endDate: item.endDate || '',
              description: item.description || '',
              gpa: item.gpa || undefined,
              ranking: item.ranking || undefined,
              totalStudents: item.totalStudents || undefined,
            }
            item._original = JSON.parse(JSON.stringify(originalData)) as typeof item
            return item
          })
          console.log('教育背景数据填充:', educationList.value)
        }

        // 填充工作经历
        if (completeData.workExperiences && completeData.workExperiences.length > 0) {
          experienceList.value = completeData.workExperiences.map(exp => {
            const item: any = {
              id: ((exp as any).experienceId || (exp as any).workExperienceId || exp.id)?.toString() || `new_${Date.now()}`,
              company: exp.company || '',
              position: exp.position || '',
              location: exp.location || '',
              industry: exp.industry || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              isCurrent: exp.isCurrent || false,
              description: exp.description || '',
              _saved: true,
              _original: undefined as any,
            }

            // 创建标准化的原始数据快照
            const originalData = {
              ...item,
              // 标准化空值处理
              company: item.company || '',
              position: item.position || '',
              location: item.location || '',
              industry: item.industry || '',
              startDate: item.startDate || '',
              endDate: item.endDate || '',
              description: item.description || '',
            }
            item._original = JSON.parse(JSON.stringify(originalData)) as typeof item
            return item
          })
          console.log('工作经历数据填充:', experienceList.value)
        }

        // 填充作品集
        if (completeData.works && completeData.works.length > 0) {
          portfolioList.value = completeData.works.map(work => ({
            id: ((work as any).workId || work.id)?.toString() || `new_${Date.now()}`, // 使用workId或id字段
            title: work.title || '',
            description: work.description || '',
            workType: work.workType || 'image',
            fileUrl: work.fileUrl || '',
            thumbnailUrl: work.thumbnailUrl || '',
            tags: work.tags ? (typeof work.tags === 'string' ? JSON.parse(work.tags) : work.tags) : [],
            isFeatured: work.isFeatured === '1',
            _saved: true, // 从服务器加载的数据标记为已保存
          }))
          console.log('作品集数据填充:', portfolioList.value)
        }

        // 填充获奖记录
        if (completeData.awards && completeData.awards.length > 0) {
          awardList.value = completeData.awards.map(award => {
            const item: any = {
              id: (award.id)?.toString() || `new_${Date.now()}`,
              title: award.title || '',
              organization: award.organization || '',
              year: award.year || '',
              level: award.level || '',
              category: award.category || '',
              workTitle: award.workTitle || '',
              description: award.description || '',
              _saved: true,
              _original: undefined as any,
            }
            item._original = JSON.parse(JSON.stringify(item))
            return item
          })
        }

        console.log('数据填充完成:', {
          基础信息: !!completeData.designer,
          教育背景: educationList.value.length,
          工作经历: experienceList.value.length,
          作品集: portfolioList.value.length,
          获奖记录: awardList.value.length,
        })

        // 标记数据加载完成
        dataLoaded.value = true
      }
    }
    else {
      console.warn('无法获取当前用户的设计师信息')
    }
  }
  catch (error) {
    console.error('加载设计师信息失败:', error)
    // 如果加载失败，不阻止用户继续使用页面
  }
  finally {
    loading.value = false
  }
}

// 填充基础表单数据
const fillBasicForm = (designer: any) => {
  if (!designer) {
    console.warn('fillBasicForm: designer 数据为空')
    return
  }

  try {
    basicForm.id = designer.id;
    basicForm.designerName = designer.designerName || '';
    basicForm.avatar = designer.avatar || '';
    basicForm.gender = designer.gender;
    basicForm.birthDate = designer.birthDate || '';
    basicForm.phone = designer.phone || '';
    basicForm.email = designer.email || '';
    basicForm.location = designer.location || '';
    basicForm.description = designer.description || '';
    basicForm.workStatus = designer.workStatus;
    basicForm.profession = designer.profession;
    basicForm.workYears = designer.workYears || 0;
    basicForm.portfolioUrl = designer.portfolioUrl || '';

    // 解析社交链接
    if (designer.socialLinks) {
      try {
        const socialLinksData = typeof designer.socialLinks === 'string'
          ? JSON.parse(designer.socialLinks)
          : designer.socialLinks
        socialLinks.value = Object.entries(socialLinksData).map(([platform, url], index) => ({
          platform,
          url: url as string,
          id: (Date.now() + index).toString(),
        }))
      } catch (error) {
        console.error('加载社交链接数据失败:', error)
        socialLinks.value = []
      }
    } else {
      socialLinks.value = []
    }

    // 保存快照
    ;(basicForm as any)._original = JSON.parse(JSON.stringify(basicForm));
  } catch (error) {
    console.error('fillBasicForm: 填充基础表单数据时出错:', error)
    throw error
  }
}

// 解析技能标签
const parseSkillTags = (skillTags: any) => {
  if (skillTags) {
    try {
      let skills: string[] = []
      if (typeof skillTags === 'string') {
        const parsed = JSON.parse(skillTags)
        skills = Array.isArray(parsed) ? parsed : []
      } else if (Array.isArray(skillTags)) {
        skills = skillTags
      }

      selectedSkillTags.value = skills as string[]

      // 保存快照
      ;(selectedSkillTags as any)._original = JSON.stringify(selectedSkillTags.value)
    }
    catch (error) {
      console.error('parseSkillTags: 解析技能标签失败:', error)
      selectedSkillTags.value = [] as string[]
      ;(selectedSkillTags as any)._original = JSON.stringify([])
    }
  } else {
    selectedSkillTags.value = [] as string[]
    ;(selectedSkillTags as any)._original = JSON.stringify([])
  }
}

// 保存当前步骤的数据，返回是否有变更
const saveCurrentStep = async (): Promise<boolean> => {
  if (!basicForm || !basicForm.id) {
    console.warn('没有设计师ID，无法保存')
    return false
  }

    let changed = false
  try {
    saving.value = true

    // 根据当前步骤保存不同的数据
    switch (currentStep.value) {
      case 'basic':
        changed = await saveBasicInfo()
        break
      case 'education':
        changed = await saveEducationData()
        break
      case 'award':
        changed = await saveAwardData()
        break
      case 'experience':
        changed = await saveExperienceData()
        break
      // case 'portfolio': // 暂时隐藏，以后开发
      //   changed = await savePortfolioData()
      //   break
    }
    return changed
  }
  catch (error) {
    console.error(`保存 ${currentStep.value} 步骤失败:`, error)

    // 输出更详细的错误信息
    if (error && typeof error === 'object') {
      console.error('错误详情:', {
        name: (error as any).name,
        message: (error as any).message,
        stack: (error as any).stack,
        ...error
      })
    }

    throw error
  }
  finally {
    saving.value = false
  }
}

// 保存基础信息
const saveBasicInfo = async (): Promise<boolean> => {
  if (!basicForm) {
    console.warn('basicForm 不存在，无法保存')
    return false
  }

    // 验证技能标签数量
  if (selectedSkillTags.value.length > 15) {
    alert('技能标签最多只能选择15个，请重新选择')
    throw new Error('技能标签数量超限')
  }

  // 判断是否有变更
  const prev = basicForm as any
  let changed = false
  const keys = ['designerName', 'avatar', 'gender', 'birthDate', 'phone', 'email', 'location', 'description', 'workStatus', 'profession', 'workYears', 'portfolioUrl']
  for (const key of keys) {
    if (prev[key] !== prev._original?.[key]) {
      changed = true
      break
    }
  }

  // 技能标签对比
  let prevTags: string[] = []
  try {
    const raw = (selectedSkillTags as any)._original || '[]';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) prevTags = parsed;
    else prevTags = [];
  } catch { prevTags = []; }

  if (JSON.stringify(selectedSkillTags.value) !== JSON.stringify(prevTags)) {
    changed = true
  }

  // 社交链接对比
  let prevSocialLinks: Array<{ platform: string; url: string; id: string }> = []
  try {
    const raw = (socialLinks as any)._original || '[]';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) prevSocialLinks = parsed;
    else prevSocialLinks = [];
  } catch { prevSocialLinks = []; }
  if (JSON.stringify(socialLinks.value) !== JSON.stringify(prevSocialLinks)) {
    changed = true
  }

  if (!changed) {
    return false
  }

  // 处理社交链接
  const socialLinksData: Record<string, string> = {}
  socialLinks.value.forEach((link) => {
    if (link.platform && link.url.trim())
      socialLinksData[link.platform] = link.url.trim()
  })

  // 准备保存的数据
  const updateData: Partial<Designer> = {
    id: basicForm.id,
    designerName: basicForm.designerName,
    avatar: basicForm.avatar,
    gender: basicForm.gender,
    birthDate: basicForm.birthDate,
    phone: basicForm.phone,
    email: basicForm.email,
    location: basicForm.location,
    description: basicForm.description,
    workStatus: basicForm.workStatus,
    profession: basicForm.profession,
    workYears: basicForm.workYears,
    portfolioUrl: basicForm.portfolioUrl,
    skillTags: JSON.stringify(selectedSkillTags.value),
    socialLinks: Object.keys(socialLinksData).length > 0 ? JSON.stringify(socialLinksData) : undefined,
  }

  try {
    // 调用API更新设计师信息
    const response = await updateDesigner(updateData)

    // 更新 _original 快照
    prev._original = JSON.parse(JSON.stringify(prev))
    ;(selectedSkillTags as any)._original = JSON.stringify(selectedSkillTags.value)
    ;(socialLinks as any)._original = JSON.stringify(socialLinks.value)

    return true
  } catch (error) {
    console.error('保存基础信息时出错:', error)
    // 重新抛出错误，让上层处理
    throw error
  }
}

// 保存教育背景数据
const isEducationChanged = (edu: any) => {
  if (!edu._original) {
    console.log('教育背景无原始数据，认为有变更:', edu.school)
    return true
  }
  const keys = ['school', 'major', 'degree', 'startDate', 'endDate', 'isCurrent', 'description', 'gpa', 'ranking', 'totalStudents']
  const changed = keys.some(key => {
    let currentValue = edu[key]
    let originalValue = edu._original[key]

    // 处理特殊情况：空值统一为 null 或 undefined
    if (currentValue === '' || currentValue === null || currentValue === undefined) {
      currentValue = null
    }
    if (originalValue === '' || originalValue === null || originalValue === undefined) {
      originalValue = null
    }

    // 数字字段的特殊处理
    if (['gpa', 'ranking', 'totalStudents'].includes(key)) {
      if (currentValue !== null && currentValue !== undefined) {
        currentValue = Number(currentValue)
      }
      if (originalValue !== null && originalValue !== undefined) {
        originalValue = Number(originalValue)
      }
    }

    const isChanged = currentValue !== originalValue
    if (isChanged) {
      console.log(`教育背景字段 ${key} 有变更:`, {
        current: currentValue,
        original: originalValue,
        school: edu.school,
        currentType: typeof currentValue,
        originalType: typeof originalValue
      })
    }
    return isChanged
  })

  if (!changed) {
    console.log('教育背景无变更，跳过:', edu.school)
  }
  return changed
}
const saveEducationData = async (): Promise<boolean> => {
  if (!basicForm || !basicForm.id) {
    console.warn('没有设计师ID，无法保存教育背景')
    return false
  }
  console.log('开始保存教育背景数据', educationList.value)
  let changed = false
  for (const education of educationList.value) {
    try {
      // 修复判断逻辑：只有ID以new_开头且_saved为false时才认为是新记录
      const isNewRecord = education.id.toString().startsWith('new_') && !education._saved
      const saveData = {
        designerId: basicForm.id,
        school: education.school,
        major: education.major,
        degree: education.degree,
        startDate: education.startDate,
        endDate: education.isCurrent ? null : education.endDate,
        isCurrent: education.isCurrent,
        description: education.description,
        gpa: education.gpa,
        ranking: education.ranking,
        totalStudents: education.totalStudents,
      }
      if (isNewRecord) {
        console.log('新增教育背景:', saveData)
        const response = await apiAddEducation(saveData)
        console.log('新增教育背景响应:', response)
        if (response && response.data) {
          // 修复ID更新逻辑：优先使用educationId，然后是id字段，确保转换为字符串
          const newId = response.data.educationId || response.data.id || response.data
          if (newId) {
            education.id = newId.toString() // 确保ID是字符串，避免精度丢失
            education._saved = true
            console.log('教育背景ID已更新:', education.id)
          } else {
            education._saved = true
            console.warn('API返回数据中未找到ID，但标记为已保存')
          }
        } else {
          education._saved = true
          console.warn('API返回数据为空，但标记为已保存')
        }
        education._original = JSON.parse(JSON.stringify(education))
        changed = true
      } else if (!education.id.toString().startsWith('new_')) {
        // 只有非新增记录且有变更时才执行更新
        if (isEducationChanged(education)) {
          const updateData = { ...saveData, id: education.id.toString() }
          console.log('更新教育背景:', updateData)
          await apiUpdateEducation(updateData)
          education._saved = true
          education._original = JSON.parse(JSON.stringify(education))
          changed = true
        } else {
          console.log('教育背景无变更，跳过:', education.school)
        }
      } else {
        console.log('教育背景已保存，跳过:', education.school)
      }
    } catch (error) {
      console.error('保存教育背景失败:', error)
      throw new Error(`保存教育背景"${education.school}"失败`)
    }
  }
  console.log('教育背景数据保存成功')
  return changed
}

// 保存工作经历数据
const isExperienceChanged = (exp: any) => {
  if (!exp._original) {
    console.log('工作经历无原始数据，认为有变更:', exp.company)
    return true
  }
  const keys = ['company', 'position', 'location', 'industry', 'startDate', 'endDate', 'isCurrent', 'description']
  const changed = keys.some(key => {
    let currentValue = exp[key]
    let originalValue = exp._original[key]

    // 处理特殊情况：空值统一为 null 或 undefined
    if (currentValue === '' || currentValue === null || currentValue === undefined) {
      currentValue = null
    }
    if (originalValue === '' || originalValue === null || originalValue === undefined) {
      originalValue = null
    }

    const isChanged = currentValue !== originalValue
    if (isChanged) {
      console.log(`工作经历字段 ${key} 有变更:`, {
        current: currentValue,
        original: originalValue,
        company: exp.company,
        currentType: typeof currentValue,
        originalType: typeof originalValue
      })
    }
    return isChanged
  })

  if (!changed) {
    console.log('工作经历无变更，跳过:', exp.company)
  }
  return changed
}
const saveExperienceData = async (): Promise<boolean> => {
  if (!basicForm || !basicForm.id) {
    console.warn('没有设计师ID，无法保存工作经历')
    return false
  }
  console.log('开始保存工作经历数据', experienceList.value)
  let changed = false
  for (const experience of experienceList.value) {
    try {
      // 修复判断逻辑：只有ID以new_开头且_saved为false时才认为是新记录
      const isNewRecord = experience.id.toString().startsWith('new_') && !experience._saved
      const saveData = {
        designerId: basicForm.id,
        company: experience.company,
        position: experience.position,
        location: experience.location,
        industry: experience.industry,
        startDate: experience.startDate,
        endDate: experience.isCurrent ? null : experience.endDate,
        isCurrent: experience.isCurrent,
        description: experience.description,
      }
      if (isNewRecord) {
        console.log('新增工作经历:', saveData)
        const response = await apiAddWorkExperience(saveData)
        console.log('新增工作经历响应:', response)
        if (response && response.data) {
          // 修复ID更新逻辑：优先使用experienceId，然后是id字段，确保转换为字符串
          const newId = response.data.experienceId || response.data.workExperienceId || response.data.id || response.data
          if (newId) {
            experience.id = newId.toString() // 确保ID是字符串，避免精度丢失
            experience._saved = true
            console.log('工作经历ID已更新:', experience.id)
          } else {
            experience._saved = true
            console.warn('API返回数据中未找到ID，但标记为已保存')
          }
        } else {
          experience._saved = true
          console.warn('API返回数据为空，但标记为已保存')
        }
        experience._original = JSON.parse(JSON.stringify(experience))
        changed = true
      } else if (!experience.id.toString().startsWith('new_')) {
        // 只有非新增记录且有变更时才执行更新
        if (isExperienceChanged(experience)) {
          const updateData = { ...saveData, id: experience.id.toString() }
          console.log('更新工作经历:', updateData)
          await apiUpdateWorkExperience(updateData)
          experience._saved = true
          experience._original = JSON.parse(JSON.stringify(experience))
          changed = true
        } else {
          console.log('工作经历无变更，跳过:', experience.company)
        }
      } else {
        console.log('工作经历已保存，跳过:', experience.company)
      }
    } catch (error) {
      console.error('保存工作经历失败:', error)
      throw new Error(`保存工作经历"${experience.company}"失败`)
    }
  }
  console.log('工作经历数据保存成功')
  return changed
}

// 保存作品集数据
const isPortfolioChanged = (portfolio: any) => {
  if (!portfolio._original) {
    console.log('作品集无原始数据，认为有变更:', portfolio.title)
    return true
  }
  const keys = ['title', 'description', 'workType', 'fileUrl', 'thumbnailUrl', 'tags', 'isFeatured']
  const changed = keys.some(key => {
    let currentValue = portfolio[key]
    let originalValue = portfolio._original[key]

    if (key === 'tags') {
      currentValue = JSON.stringify(currentValue || [])
      originalValue = JSON.stringify(originalValue || [])
    } else {
      // 处理特殊情况：空值统一为 null 或 undefined
      if (currentValue === '' || currentValue === null || currentValue === undefined) {
        currentValue = null
      }
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        originalValue = null
      }
    }

    const isChanged = currentValue !== originalValue
    if (isChanged) {
      console.log(`作品集字段 ${key} 有变更:`, {
        current: currentValue,
        original: originalValue,
        title: portfolio.title,
        currentType: typeof currentValue,
        originalType: typeof originalValue
      })
    }
    return isChanged
  })

  if (!changed) {
    console.log('作品集无变更，跳过:', portfolio.title)
  }
  return changed
}
const savePortfolioData = async (): Promise<boolean> => {
  if (!basicForm || !basicForm.id) {
    console.warn('没有设计师ID，无法保存作品集')
    return false
  }
  console.log('开始保存作品集数据', portfolioList.value)
  let changed = false
  for (const portfolio of portfolioList.value) {
    try {
      // 修复判断逻辑：只有ID以new_开头且_saved为false时才认为是新记录
      const isNewRecord = portfolio.id.toString().startsWith('new_') && !portfolio._saved
      const saveData = {
        designerId: basicForm.id,
        title: portfolio.title,
        description: portfolio.description,
        workType: portfolio.workType,
        fileUrl: portfolio.fileUrl,
        thumbnailUrl: portfolio.thumbnailUrl,
        tags: JSON.stringify(portfolio.tags || []),
        isFeatured: portfolio.isFeatured ? '1' : '0',
      }
      if (isNewRecord) {
        console.log('新增作品:', saveData)
        const response = await apiAddWork(saveData)
        console.log('新增作品响应:', response)
        if (response && response.data) {
          // 修复ID更新逻辑：优先使用workId，然后是id字段，确保转换为字符串
          const newId = response.data.workId || response.data.id || response.data
          if (newId) {
            portfolio.id = newId.toString() // 确保ID是字符串，避免精度丢失
            portfolio._saved = true
            console.log('作品ID已更新:', portfolio.id)
          } else {
            portfolio._saved = true
            console.warn('API返回数据中未找到ID，但标记为已保存')
          }
        } else {
          portfolio._saved = true
          console.warn('API返回数据为空，但标记为已保存')
        }
        portfolio._original = JSON.parse(JSON.stringify(portfolio))
        changed = true
      } else if (!portfolio.id.toString().startsWith('new_')) {
        // 只有非新增记录且有变更时才执行更新
        if (isPortfolioChanged(portfolio)) {
          const updateData = { ...saveData, id: portfolio.id.toString() }
          console.log('更新作品:', updateData)
          await apiUpdateWork(updateData)
          portfolio._saved = true
          portfolio._original = JSON.parse(JSON.stringify(portfolio))
          changed = true
        } else {
          console.log('作品无变更，跳过:', portfolio.title)
        }
      } else {
        // 已保存的新记录，跳过
        console.log('作品已保存，跳过:', portfolio.title)
      }
    } catch (error) {
      console.error('保存作品失败:', error)
      throw new Error(`保存作品"${portfolio.title}"失败`)
    }
  }
  console.log('作品集数据保存成功')
  return changed
}

// 下拉菜单切换
const toggleGenderDropdown = () => {
  showGenderDropdown.value = !showGenderDropdown.value
  showJobTypeDropdown.value = false
  showWorkStatusDropdown.value = false
}

const toggleJobTypeDropdown = () => {
  showJobTypeDropdown.value = !showJobTypeDropdown.value
  showGenderDropdown.value = false
  showWorkStatusDropdown.value = false
}

const toggleWorkStatusDropdown = () => {
  showWorkStatusDropdown.value = !showWorkStatusDropdown.value
  showGenderDropdown.value = false
  showJobTypeDropdown.value = false
}

// 选择性别
const selectGender = (option: { value: string; label: string }) => {
  if (!basicForm) return
  basicForm.gender = option.value as '0' | '1' | '2'
  showGenderDropdown.value = false
}

// 选择职业类型
const selectJobType = (option: { value: string; label: string }) => {
  if (!basicForm) return
  basicForm.profession = option.value as any
  showJobTypeDropdown.value = false
}

// 选择工作状态
const selectWorkStatus = (option: { value: WorkStatus; label: string }) => {
  if (!basicForm) return
  basicForm.workStatus = option.value
  showWorkStatusDropdown.value = false
}

// 头像上传
const handleAvatarUpload = () => {
  if (!basicForm) {
    console.warn('basicForm 不存在，无法上传头像')
    return
  }

  const avatarUrls = [
    'https://readdy.ai/api/search-image?query=professional%20asian%20young%20designer%20portrait%20with%20neutral%20expression%2C%20high%20quality%20professional%20headshot%2C%20simple%20dark%20background%2C%20modern%20minimal%20style%2C%20soft%20lighting&width=200&height=200&seq=avatar001&orientation=squarish',
    'https://readdy.ai/api/search-image?query=professional%20asian%20young%20male%20designer%20portrait%20with%20neutral%20expression%2C%20high%20quality%20professional%20headshot%2C%20simple%20dark%20background%2C%20modern%20minimal%20style%2C%20soft%20lighting&width=200&height=200&seq=avatar002&orientation=squarish',
  ]

  if (!basicForm.avatar)
    basicForm.avatar = avatarUrls[0]
  else
    basicForm.avatar = avatarUrls[1]
}

// 清空出生日期
const clearBirthDate = () => {
  if (!basicForm) {
    console.warn('basicForm 不存在，无法清空出生日期')
    return
  }
  basicForm.birthDate = ''
}

// 技能标签操作
const getSkillTagClasses = (tag: string) => SkillTagUtils.getTagClasses(tag, 'sm')
const getSkillTagDisplayName = (tag: string) => SkillTagUtils.getTagDisplayName(tag)

// 计算工作时长
const calculateWorkDuration = (startDate: string, endDate: string | undefined, isCurrent: boolean): string => {
  if (!startDate) return ''

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  if (start > end) return ''

  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  let duration = ''
  if (years > 0) {
    duration += `${years}年`
  }
  if (months > 0) {
    duration += `${months}个月`
  }
  if (duration === '') {
    duration = '不足1个月'
  }

  return duration + (isCurrent ? ' (至今)' : '')
}

// URL验证函数 - 支持带协议和不带协议的链接
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl)
    return false

  try {
    // 首先尝试直接验证URL（适用于带协议的链接）
    new URL(trimmedUrl)
    return true
  }
  catch {
    try {
      // 如果直接验证失败，尝试加上https://前缀（适用于不带协议的链接）
      new URL(`https://${trimmedUrl}`)
      return true
    }
    catch {
      return false
    }
  }
}

// 基础字段验证函数
const validateBasicFields = () => {
  if (!basicForm) {
    alert('表单数据未加载，请稍后再试')
    return false
  }

  // 检查姓名
  if (!basicForm.designerName?.trim()) {
    alert('请至少填写姓名')
    return false
  }

  // 检查技能标签数量（如果已选择）
  if (selectedSkillTags.value.length > 15) {
    alert('技能标签最多只能选择15个，请重新选择')
    return false
  }

  // 检查手机号格式（如果已填写）
  if (basicForm.phone && basicForm.phone.trim()) {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(basicForm.phone.trim())) {
      alert('手机号格式不正确，请输入11位有效手机号')
      return false
    }
  }

  // 检查邮箱格式（如果已填写）
  if (basicForm.email && basicForm.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(basicForm.email.trim())) {
      alert('邮箱格式不正确，请输入有效邮箱地址')
      return false
    }
  }

  // 检查作品集链接格式（如果已填写）
  if (basicForm.portfolioUrl && basicForm.portfolioUrl.trim()) {
    if (!isValidUrl(basicForm.portfolioUrl.trim())) {
      alert('作品集链接格式不正确，请输入有效的网址')
      return false
    }
  }

  return true
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showGenderDropdown.value = false
    showJobTypeDropdown.value = false
    showWorkStatusDropdown.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadDesignerData()
  fetchProfileCompleteness()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 个人链接数据
const socialLinks = ref<Array<{ platform: string; url: string; id: string }>>([])

// 添加个人链接
const addSocialLink = () => {
  socialLinks.value.push({
    platform: '',
    url: '',
    id: Date.now().toString(),
  })
}

// 删除个人链接
const removeSocialLink = (id: string) => {
  const index = socialLinks.value.findIndex(link => link.id === id)
  if (index > -1)
    socialLinks.value.splice(index, 1)
}

// 添加示例链接
const addSampleSocialLinks = () => {
  const sampleLinks = [
    { platform: 'Github', url: 'https://github.com/your-profile' },
    { platform: '站酷', url: 'https://www.zcool.com.cn/u/your-profile' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/your-profile' },
  ]
  sampleLinks.forEach((sample, index) => {
    socialLinks.value.push({
      platform: sample.platform,
      url: sample.url,
      id: (Date.now() + index).toString(),
    })
  })
}

// 获奖记录列表
const awardList = ref<any[]>([])

// 获奖记录操作
const addAwardRecord = () => {
  const item: any = {
    id: `new_${Date.now()}`,
    title: '',
    organization: '',
    year: '',
    level: '',
    category: '',
    workTitle: '',
    description: '',
    _saved: false,
    _original: undefined as any,
  }
  item._original = JSON.parse(JSON.stringify(item)) as typeof item
  awardList.value.push(item)
}
const removeAwardRecord = async (id: string) => {
  const index = awardList.value.findIndex(item => item.id.toString() === id.toString())
  if (index === -1) return
  const award = awardList.value[index]
  if (!confirm(`确定要删除获奖记录"${award.title || '未命名奖项'}"吗？删除后无法恢复。`)) return
  try {
    if (!id.toString().startsWith('new_')) {
      await apiDeleteAward(id.toString())
    }
    awardList.value.splice(index, 1)
  } catch (error) {
    alert(`删除获奖记录"${award.title}"失败，请重试`)
  }
}

// 保存获奖记录数据
const isAwardChanged = (award: any) => {
  if (!award._original) return true
  const keys = ['title', 'organization', 'year', 'level', 'category', 'workTitle', 'description']
  return keys.some(key => (award[key] || '') !== (award._original[key] || ''))
}
const saveAwardData = async (): Promise<boolean> => {
  if (!basicForm || !basicForm.id) return false
  let changed = false
  for (const award of awardList.value) {
    try {
      const isNewRecord = award.id.toString().startsWith('new_') && !award._saved
      const saveData = {
        designerId: basicForm.id,
        title: award.title,
        organization: award.organization,
        year: award.year,
        level: award.level,
        category: award.category,
        workTitle: award.workTitle,
        description: award.description,
      }
      if (isNewRecord) {
        const response = await apiAddAward(saveData)
        if (response && response.data) {
          const newId = response.data.id || response.data.awardId || response.data
          if (newId) {
            award.id = newId.toString()
            award._saved = true
          } else {
            award._saved = true
          }
        } else {
          award._saved = true
        }
        award._original = JSON.parse(JSON.stringify(award))
        changed = true
      } else if (!award.id.toString().startsWith('new_')) {
        if (isAwardChanged(award)) {
          const updateData = { ...saveData, id: award.id.toString() }
          await apiUpdateAward(updateData)
          award._saved = true
          award._original = JSON.parse(JSON.stringify(award))
          changed = true
        }
      }
    } catch (error) {
      throw new Error(`保存获奖记录"${award.title}"失败`)
    }
  }
  return changed
}
</script>

<template>
	<div class="talent-page">
		<!-- 统一顶栏 -->
		<TalentHeader />

		<!-- 页面标题区 -->
		<section class="py-6 md:py-12 relative mt-20 md:mt-16">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30" />
			<div class="container mx-auto px-10 relative z-10">
				<div class="text-center">
					<div
						class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow-border">
						<i class="ri-user-settings-line text-3xl text-white" />
					</div>
					<h1 class="text-4xl font-bold mb-2 text-white">
						🎨 完善设计师档案
					</h1>
					<p class="text-gray-300 max-w-2xl mx-auto">
						补充您的详细信息，提升档案完整度，获得更多机会和曝光
					</p>
				</div>
			</div>
		</section>

		<!-- 主体内容区 -->
		<section class="flex-grow pb-8">
			<div class="container mx-auto px-4">
				<!-- 信息完整度引导 -->
				<div class="max-w-6xl mx-auto mb-8">
					<ProfileCompletenessGuide :completeness="profileCompleteness" />
				</div>

				<!-- 步骤导航 -->
				<div class="max-w-6xl mx-auto mb-8">
					<div class="glass-card rounded-lg glow-border p-6">
						<div class="flex items-center justify-between">
							<div v-for="(step, index) in steps" :key="step.id" class="flex-1 flex items-center"
								:class="{ 'justify-end': index === steps.length - 1 }">
								<div class="flex items-center">
									<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
										:class="[
                      currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110'
                        : completedSteps.includes(step.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-400',
                    ]">
										<i v-if="completedSteps.includes(step.id)" class="ri-check-line" />
										<span v-else>{{ index + 1 }}</span>
									</div>
									<div class="ml-3 hidden md:block">
										<div class="text-sm font-medium" :class="[
                        currentStep === step.id ? 'text-white' : 'text-gray-400',
                      ]">
											{{ step.title }}
										</div>
										<div class="text-xs text-gray-500">
											{{ step.description }}
										</div>
									</div>
								</div>
								<div v-if="index < steps.length - 1" class="flex-1 h-0.5 mx-4 transition-colors" :class="[
                    completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-700',
                  ]" />
							</div>
						</div>
					</div>
				</div>

				<!-- 表单内容 -->
				<div class="max-w-6xl mx-auto">
					<div class="glass-card rounded-lg glow-border p-6 md:p-8">
						<!-- 加载状态 -->
						<div v-if="loading" class="text-center py-12">
							<div
								class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
								<i class="ri-loader-4-line text-2xl text-white animate-spin" />
							</div>
							<p class="text-gray-300 text-lg font-medium mb-2">
								正在获取您的完整档案...
							</p>
							<p class="text-gray-400 text-sm">
								包括基础信息、教育背景、工作经历和作品集
							</p>
						</div>

						<!-- 基础信息步骤 -->
						<div v-else-if="currentStep === 'basic'" class="space-y-8">
							<form v-if="basicForm" ref="formElement" novalidate @submit.prevent="handleBasicFormSubmit">
								<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
									<!-- 左栏：基础信息 -->
									<div>
										<div class="mb-6">
											<h2 class="text-xl font-bold mb-4 flex items-center">
												<div
													class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
													<i class="ri-user-line" />
												</div>
												基础信息
											</h2>

											<!-- 姓名 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">
													姓名 <span class="text-red-500">*</span>
												</label>
												<input v-model="basicForm.designerName" type="text"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="请输入您的姓名" required minlength="2" maxlength="20" title="请输入您的姓名，长度2-20个字符">
											</div>

											<!-- 头像上传与工作状态 -->
											<div class="mb-4">
												<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
													<!-- 头像上传 -->
													<div>
														<label class="block text-gray-300 mb-2">头像</label>
														<div class="flex items-center">
															<div
																class="w-16 h-16 rounded-full overflow-hidden bg-gray-800 avatar-upload flex items-center justify-center mr-4"
																:style="avatarStyle" />
															<button type="button"
																class="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap"
																@click="handleAvatarUpload">
																{{ basicForm.avatar ? '更换图片' : '选择图片' }}
															</button>
														</div>
													</div>

													<!-- 工作状态 -->
													<div>
														<label class="block text-gray-300 mb-2">工作状态</label>
														<div class="relative">
															<div
																class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer"
																@click="toggleWorkStatusDropdown">
																<span>{{ workStatusText }}</span>
																<i class="ri-arrow-down-s-line" />
															</div>
															<div v-show="showWorkStatusDropdown"
																class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg">
																<div v-for="option in workStatusOptions" :key="option.value"
																	class="py-2 px-4 hover:bg-gray-800 cursor-pointer" @click="selectWorkStatus(option)">
																	{{ option.label }}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<!-- 性别和出生日期 -->
											<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
												<div>
													<label class="block text-gray-300 mb-2">性别</label>
													<div class="relative">
														<div
															class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer"
															@click="toggleGenderDropdown">
															<span>{{ genderText }}</span>
															<i class="ri-arrow-down-s-line" />
														</div>
														<div v-show="showGenderDropdown"
															class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg">
															<div v-for="option in genderOptions" :key="option.value"
																class="py-2 px-4 hover:bg-gray-800 cursor-pointer" @click="selectGender(option)">
																{{ option.label }}
															</div>
														</div>
													</div>
												</div>
												<div>
													<label class="block text-gray-300 mb-2">出生日期</label>
													<div class="relative">
														<input v-model="basicForm.birthDate" type="date"
															class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input"
															:class="[
                                { 'has-clear-button': basicForm.birthDate },
                              ]">
														<button v-if="basicForm.birthDate" type="button"
															class="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white transition-colors"
															title="清空日期" @click="clearBirthDate">
															<i class="ri-close-line text-sm" />
														</button>
													</div>
												</div>
											</div>

											<!-- 手机号和邮箱 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">手机号</label>
												<input v-model="basicForm.phone" type="tel" pattern="^1[3-9]\d{9}$"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="请输入您的手机号码" title="请输入11位手机号码">
											</div>
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">邮箱</label>
												<input v-model="basicForm.email" type="email"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="请输入您的邮箱地址" title="请输入有效的邮箱地址">
											</div>

										</div>
									</div>

									<!-- 右栏：专业信息 -->
									<div>
										<div class="mb-6">
											<h2 class="text-xl font-bold mb-4 flex items-center">
												<div
													class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2">
													<i class="ri-briefcase-line" />
												</div>
												专业信息
											</h2>

											<!-- 职业类型 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">职业类型</label>
												<div class="relative">
													<div
														class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer"
														@click="toggleJobTypeDropdown">
														<span>{{ jobTypeText }}</span>
														<i class="ri-arrow-down-s-line" />
													</div>
													<div v-show="showJobTypeDropdown"
														class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
														<div v-for="option in jobTypeOptions" :key="option.value"
															class="py-2 px-4 hover:bg-gray-800 cursor-pointer" @click="selectJobType(option)">
															{{ option.label }}
														</div>
													</div>
												</div>
											</div>

											<!-- 工作年限 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">工作年限</label>
												<div class="flex items-center">
													<input v-model="basicForm.workYears" type="range" min="0" max="20"
														class="flex-1 mr-4 custom-range">
													<span class="text-white font-medium w-8">{{ basicForm.workYears }}</span>
													<span class="text-gray-400 ml-1">年</span>
												</div>
											</div>

											<!-- 技能标签 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">
													技能标签
													<span class="text-sm text-gray-400 ml-2">(最多选择15个)</span>
												</label>
												<div class="relative mb-2">
													<div
														class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 cursor-pointer hover:border-primary transition-colors flex items-center justify-between"
														@click="showSkillTagSelector = true">
														<span v-if="selectedSkillTags.length === 0" class="text-gray-400">
															点击选择技能标签
														</span>
														<span v-else class="text-white">
															已选择 {{ selectedSkillTags.length }} 个标签
															<span class="text-sm text-gray-400 ml-2">
																|
																<span class="text-blue-400">{{ selectedTagsByCategory.tool.length }}</span> 工具
																<span class="text-purple-400 ml-1">{{ selectedTagsByCategory.field.length }}</span> 领域
																<span class="text-pink-400 ml-1">{{ selectedTagsByCategory.skill.length }}</span> 技能
															</span>
														</span>
														<i class="ri-arrow-down-s-line text-gray-400" />
													</div>
												</div>
												<div class="flex flex-wrap gap-2" :class="[selectedSkillTags.length > 0 ? 'min-h-8' : 'h-0']">
													<span v-for="tag in sortedSelectedTags" :key="tag" class="inline-flex items-center"
														:class="[getSkillTagClasses(tag)]">
														{{ getSkillTagDisplayName(tag) }}
														<button type="button"
															class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20"
															@click="removeSkillTag(tag)">
															<i class="ri-close-line text-xs" />
														</button>
													</span>
												</div>
											</div>

											<!-- 个人简介 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">个人简介</label>
												<textarea v-model="basicForm.description"
													class="w-full h-24 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="请简要介绍您的设计经历、专长和风格特点" />
											</div>

											<!-- 作品集链接 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">作品集链接</label>
												<input v-model="basicForm.portfolioUrl" type="url"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="请输入您的作品集网址（如 Behance、Dribbble 等）" title="请输入完整的网址，如 https://example.com">
											</div>
											<!-- 个人链接 -->
											<div class="mb-4">
												<label class="block text-gray-300 mb-2">个人链接</label>
												<p class="text-gray-500 text-sm mb-3">
													添加您的个人网站或在线作品展示平台
												</p>
												<div class="space-y-3 rounded border border-transparent">
													<div v-for="(link, index) in socialLinks" :key="link.id" class="flex items-center gap-3">
														<!-- 网站名称输入框 -->
														<input v-model="link.platform" type="text" placeholder="网站名称"
															class="w-32 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-3 py-3 social-link-input focus:outline-none focus:border-primary">
														<!-- URL输入框 -->
														<input v-model="link.url" type="url" placeholder="请输入网站链接地址"
															class="flex-1 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 social-link-input focus:outline-none focus:border-primary">
														<!-- 删除按钮 -->
														<button type="button"
															class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 social-remove-btn"
															title="删除链接" @click="removeSocialLink(link.id)">
															<i class="ri-close-line text-sm" />
														</button>
													</div>
													<!-- 添加链接按钮 -->
													<div class="flex gap-2">
														<button type="button"
															class="flex-1 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-2 flex items-center justify-center hover:bg-gray-700 transition-colors text-sm"
															@click="addSocialLink">
															<i class="ri-add-line mr-2" />
															添加链接
														</button>
														<button v-if="socialLinks.length === 0" type="button"
															class="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded text-blue-400 hover:bg-blue-500/30 transition-colors text-sm whitespace-nowrap"
															title="添加示例数据" @click="addSampleSocialLinks">
															<i class="ri-lightbulb-line mr-1" />
															示例
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
							<div v-else class="text-center py-12">
								<div class="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
									<i class="ri-loader-4-line text-2xl text-gray-400 animate-spin" />
								</div>
								<p class="text-gray-300 text-lg font-medium">
									正在加载表单数据...
								</p>
							</div>
						</div>

						<!-- 教育背景步骤 -->
						<div v-if="currentStep === 'education'" class="space-y-6">
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center">
									<div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
										<i class="ri-graduation-cap-line" />
									</div>
									<h2 class="text-xl font-bold">
										教育背景
									</h2>
								</div>
								<button class="neon-button px-4 py-2 text-sm" @click="addEducation">
									<i class="ri-add-line mr-1" />
									添加教育经历
								</button>
							</div>

							<div v-if="educationList.length === 0" class="text-center py-12">
								<div
									class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow-border">
									<i class="ri-graduation-cap-line text-2xl text-white" />
								</div>
								<p class="text-gray-300 text-lg font-medium mb-2">
									还没有添加教育背景
								</p>
								<p class="text-gray-400 text-sm mb-4">
									添加您的教育经历来完善档案
								</p>
								<button class="secondary-button" @click="addEducation">
									添加第一个教育经历
								</button>
							</div>

							<div v-else class="space-y-4">
								<div v-for="(education, index) in educationList" :key="education.id"
									class="glass-card rounded-lg glow-border p-4 md:p-6">
									<div class="flex justify-between items-start mb-4">
										<div class="flex items-center">
											<div
												class="w-6 h-6 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2">
												<i class="ri-graduation-cap-line text-sm" />
											</div>
											<h3 class="text-base font-bold text-white">
												教育经历 {{ index + 1 }}
											</h3>
										</div>
										<button
											class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors"
											title="删除这个教育经历" @click="removeEducation(education.id.toString())">
											<i class="ri-delete-bin-line text-sm" />
										</button>
									</div>

									<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
										<div>
											<label class="block text-gray-300 mb-2">
												学校名称 <span class="text-red-500">*</span>
											</label>
											<input v-model="education.school" type="text"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												placeholder="请输入学校名称" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">
												专业 <span class="text-red-500">*</span>
											</label>
											<input v-model="education.major" type="text"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												placeholder="请输入专业名称" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">
												学历 <span class="text-red-500">*</span>
											</label>
											<select v-model="education.degree"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												required>
												<option value="">
													请选择学历
												</option>
												<option value="HIGH_SCHOOL">
													高中
												</option>
												<option value="COLLEGE">
													专科
												</option>
												<option value="BACHELOR">
													本科
												</option>
												<option value="MASTER">
													硕士
												</option>
												<option value="DOCTOR">
													博士
												</option>
											</select>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">
												开始时间 <span class="text-red-500">*</span>
											</label>
											<input v-model="education.startDate" type="date"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input"
												required>
										</div>
										<div v-if="!education.isCurrent">
											<label class="block text-gray-300 mb-2">结束时间</label>
											<input v-model="education.endDate" type="date"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input"
												:data-enddate-index="index">
										</div>
										<div class="flex items-center">
											<label class="flex items-center cursor-pointer">
												<input v-model="education.isCurrent" type="checkbox"
													class="w-4 h-4 text-primary bg-transparent border-2 border-gray-600 rounded focus:ring-primary focus:ring-2 mr-3">
												<span class="text-gray-300 select-none">目前仍在此学校就读</span>
											</label>
										</div>
									</div>

									<!-- 学术表现信息 -->
									<div class="mt-4 pt-4 border-t border-gray-700">
										<h4 class="text-sm font-medium text-gray-300 mb-4 flex items-center">
											<i class="ri-medal-line mr-2 text-yellow-500" />
											学术表现 (可选)
										</h4>
										<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
											<div>
												<label class="block text-gray-300 mb-2">GPA/绩点</label>
												<input v-model="education.gpa" type="number" step="0.01" min="0" max="5"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="如：3.85" title="GPA不能大于5">
											</div>
											<div>
												<label class="block text-gray-300 mb-2">年级排名</label>
												<input v-model="education.ranking" type="number" min="1" step="1" pattern="\d*" :data-ranking-index="index"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="如：5"
													@input="education.ranking = education.ranking ? education.ranking.toString().replace(/[^\d]/g, '').replace(/^0+/, '') : ''"
												/>
											</div>
											<div v-if="education.ranking">
												<label class="block text-gray-300 mb-2">年级总人数</label>
												<input v-model="education.totalStudents" type="number" min="1" step="1" pattern="\d*"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
													placeholder="如：150"
													@input="education.totalStudents = education.totalStudents ? education.totalStudents.toString().replace(/[^\d]/g, '').replace(/^0+/, '') : ''"
												/>
											</div>
										</div>
										<div v-if="education.ranking && education.totalStudents" class="mt-2">
											<p class="text-xs text-gray-400">
												<i class="ri-information-line mr-1" />
												排名百分比：前 {{ Math.max(0.1, Number(((education.ranking / education.totalStudents) *
												100).toFixed(1))) }}%
											</p>
										</div>
									</div>

									<div class="mt-4 lg:col-span-2">
										<label class="block text-gray-300 mb-2">学习描述</label>
										<textarea v-model="education.description"
											class="w-full h-20 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary resize-none"
											placeholder="描述您的学习经历、主要课程、学术成就或相关项目经验..." />
									</div>
								</div>
							</div>
						</div>

						<!-- 获奖记录步骤 -->
						<div v-if="currentStep === 'award'" class="space-y-6">
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center">
									<div class="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500 mr-2">
										<i class="ri-medal-line" />
									</div>
									<h2 class="text-xl font-bold">获奖记录</h2>
								</div>
								<button class="neon-button px-4 py-2 text-sm" @click="addAwardRecord">
									<i class="ri-add-line mr-1" />添加获奖经历
								</button>
							</div>
							<div v-if="awardList.length === 0" class="text-center py-12">
								<div class="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
									<i class="ri-medal-line text-2xl text-yellow-500" />
								</div>
								<p class="text-gray-300 text-lg font-medium mb-2">还没有添加获奖记录</p>
								<p class="text-gray-400 text-sm mb-4">添加您的获奖经历来提升档案</p>
								<button class="secondary-button" @click="addAwardRecord">添加第一个获奖经历</button>
							</div>
							<div v-else class="space-y-4">
								<div v-for="(award, index) in awardList" :key="award.id" class="glass-card rounded-lg glow-border p-4 md:p-6">
									<div class="flex justify-between items-start mb-4">
										<div class="flex items-center">
											<div class="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500 mr-2">
												<i class="ri-medal-line text-sm" />
											</div>
											<h3 class="text-base font-bold text-white">获奖经历 {{ index + 1 }}</h3>
										</div>
										<button class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors" title="删除这个获奖经历" @click="removeAwardRecord(award.id.toString())">
											<i class="ri-delete-bin-line text-sm" />
										</button>
									</div>
									<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
										<div>
											<label class="block text-gray-300 mb-2">奖项名称 <span class="text-red-500">*</span></label>
											<input v-model="award.title" type="text" :data-award-title-index="index" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="请输入奖项名称" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">颁发机构 <span class="text-red-500">*</span></label>
											<input v-model="award.organization" type="text" :data-award-org-index="index" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="请输入颁发机构" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">获奖年份 <span class="text-red-500">*</span></label>
											<input v-model="award.year" type="number" min="1900" max="2100" step="1" pattern="\\d*" :data-award-year-index="index" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="如：2023" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">奖项级别</label>
											<input v-model="award.level" type="text" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="如：金奖、银奖、优秀奖">
										</div>
										<div>
											<label class="block text-gray-300 mb-2">奖项类别</label>
											<input v-model="award.category" type="text" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="如：UI设计、品牌设计">
										</div>
										<div>
											<label class="block text-gray-300 mb-2">获奖作品</label>
											<input v-model="award.workTitle" type="text" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" placeholder="如：某某作品名称">
										</div>
									</div>
									<div class="mt-4 lg:col-span-2">
										<label class="block text-gray-300 mb-2">获奖描述</label>
										<textarea v-model="award.description" class="w-full h-20 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary resize-none" placeholder="描述您的获奖背景、参赛作品、评审亮点等..." />
									</div>
								</div>
							</div>
						</div>

						<!-- 工作经历步骤 -->
						<div v-if="currentStep === 'experience'" class="space-y-6">
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center">
									<div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
										<i class="ri-briefcase-line" />
									</div>
									<h2 class="text-xl font-bold">
										工作经历
									</h2>
								</div>
								<button class="neon-button px-4 py-2 text-sm" @click="addExperience">
									<i class="ri-add-line mr-1" />
									添加工作经历
								</button>
							</div>

							<div v-if="experienceList.length === 0" class="text-center py-12">
								<div
									class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow-border">
									<i class="ri-briefcase-line text-2xl text-white" />
								</div>
								<p class="text-gray-300 text-lg font-medium mb-2">
									还没有添加工作经历
								</p>
								<p class="text-gray-400 text-sm mb-4">
									添加您的工作经验来展示专业能力
								</p>
								<button class="secondary-button" @click="addExperience">
									添加第一个工作经历
								</button>
							</div>

							<div v-else class="space-y-4">
								<div v-for="(experience, index) in experienceList" :key="experience.id"
									class="glass-card rounded-lg glow-border p-4 md:p-6">
									<div class="flex justify-between items-start mb-4">
										<div class="flex items-center">
											<div
												class="w-6 h-6 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2">
												<i class="ri-briefcase-line text-sm" />
											</div>
											<h3 class="text-base font-bold text-white">
												工作经历 {{ index + 1 }}
											</h3>
										</div>
										<button
											class="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors"
											title="删除这个工作经历" @click="removeExperience(experience.id.toString())">
											<i class="ri-delete-bin-line text-sm" />
										</button>
									</div>

									<!-- 基本信息 -->
									<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
										<div>
											<label class="block text-gray-300 mb-2">
												公司名称 <span class="text-red-500">*</span>
											</label>
											<input v-model="experience.company" type="text"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												placeholder="请输入公司名称" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">
												职位名称 <span class="text-red-500">*</span>
											</label>
											<input v-model="experience.position" type="text"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												placeholder="如：UI设计师、产品设计师" required>
										</div>
										<div>
											<label class="block text-gray-300 mb-2">工作地点</label>
											<input v-model="experience.location" type="text"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
												placeholder="如：北京市朝阳区、远程办公">
										</div>
										<div>
											<label class="block text-gray-300 mb-2">行业类型</label>
											<select v-model="experience.industry"
												class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary">
												<option value="">
													请选择行业
												</option>
												<option value="互联网">
													互联网/科技
												</option>
												<option value="游戏">
													游戏娱乐
												</option>
												<option value="电商">
													电子商务
												</option>
												<option value="金融">
													金融服务
												</option>
												<option value="教育">
													教育培训
												</option>
												<option value="医疗">
													医疗健康
												</option>
												<option value="传媒">
													传媒广告
												</option>
												<option value="制造业">
													制造业
												</option>
												<option value="房地产">
													房地产
												</option>
												<option value="零售">
													零售消费
												</option>
												<option value="汽车">
													汽车行业
												</option>
												<option value="政府">
													政府机构
												</option>
												<option value="非营利">
													非营利组织
												</option>
												<option value="其他">
													其他
												</option>
											</select>
										</div>
									</div>

									<!-- 时间信息 -->
									<div class="mt-4 pt-4 border-t border-gray-700">
										<h4 class="text-sm font-medium text-gray-300 mb-4 flex items-center">
											<i class="ri-calendar-line mr-2 text-blue-500" />
											任职时间
										</h4>
										<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
											<div>
												<label class="block text-gray-300 mb-2">
													入职时间 <span class="text-red-500">*</span>
												</label>
												<input v-model="experience.startDate" type="date"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input"
													required>
											</div>
											<div v-if="!experience.isCurrent">
												<label class="block text-gray-300 mb-2">离职时间</label>
												<input v-model="experience.endDate" type="date"
													class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input"
													:data-exp-enddate-index="index">
											</div>
										</div>
										<div class="mt-3 flex items-center justify-between">
											<label class="flex items-center cursor-pointer">
												<input v-model="experience.isCurrent" type="checkbox"
													class="w-4 h-4 text-primary bg-transparent border-2 border-gray-600 rounded focus:ring-primary focus:ring-2 mr-3">
												<span class="text-gray-300 select-none">目前仍在此公司工作</span>
											</label>
											<!-- 工作时长计算 -->
											<div v-if="experience.startDate && (experience.endDate || experience.isCurrent)"
												class="text-xs text-gray-400">
												<i class="ri-time-line mr-1" />
												{{ calculateWorkDuration(experience.startDate, experience.endDate, experience.isCurrent) }}
											</div>
										</div>
									</div>

									<div class="mt-4 lg:col-span-2">
										<label class="block text-gray-300 mb-2">工作描述</label>
										<textarea v-model="experience.description"
											class="w-full h-20 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary resize-none"
											placeholder="描述您的工作职责、主要成就、负责的项目或团队管理经验..." />
									</div>
								</div>
							</div>
						</div>

						<!-- 作品集步骤 - 暂时隐藏，以后开发 -->
						<!--
						<div v-if="currentStep === 'portfolio'" class="space-y-8">
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center">
									<i class="ri-gallery-line ri-lg text-gradient mr-2" />
									<h3 class="text-xl font-medium text-white">
										作品集
									</h3>
								</div>
								<button class="neon-button px-4 py-2 text-sm" @click="addPortfolio">
									<i class="ri-add-line mr-1" />
									上传作品
								</button>
							</div>

							<div v-if="portfolioList.length === 0" class="text-center py-12">
								<div class="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
									<i class="ri-gallery-line text-2xl text-gray-400" />
								</div>
								<p class="text-gray-400 mb-4">
									还没有上传作品
								</p>
								<button class="secondary-button" @click="addPortfolio">
									上传第一个作品
								</button>
							</div>

							<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div v-for="portfolio in portfolioList" :key="portfolio.id"
									class="glass-card rounded-lg overflow-hidden border border-gray-700 group">
									<div class="aspect-video bg-gray-800 flex items-center justify-center relative">
										<img v-if="portfolio.thumbnailUrl" :src="portfolio.thumbnailUrl" class="w-full h-full object-cover">
										<i v-else class="ri-image-line text-4xl text-gray-400" />

										<div
											class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
											<button class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
												<i class="ri-eye-line text-white text-sm" />
											</button>
											<button class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
												@click="removePortfolio(portfolio.id.toString())">
												<i class="ri-delete-bin-line text-white text-sm" />
											</button>
										</div>

										<div v-if="portfolio.isFeatured" class="absolute top-2 right-2">
											<span class="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-medium">
												代表作品
											</span>
										</div>
									</div>

									<div class="p-4">
										<h4 class="font-medium text-white mb-2 truncate">
											{{ portfolio.title || '未命名作品' }}
										</h4>
										<p class="text-sm text-gray-400 line-clamp-2">
											{{ portfolio.description || '暂无描述' }}
										</p>

										<div v-if="portfolio.tags && portfolio.tags.length > 0" class="flex flex-wrap gap-1 mt-3">
											<span v-for="tag in portfolio.tags.slice(0, 3)" :key="tag"
												class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
												{{ tag }}
											</span>
											<span v-if="portfolio.tags.length > 3"
												class="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded">
												+{{ portfolio.tags.length - 3 }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						-->

						<!-- 底部按钮 -->
						<div class="flex items-center justify-between pt-6 mt-6">
							<!-- 左侧按钮 -->
							<div class="flex-shrink-0">
								<button v-if="currentStep !== 'basic'" class="secondary-button px-6 py-3" @click="previousStep">
									<i class="ri-arrow-left-line mr-2" />
									上一步
								</button>
								<div v-else class="w-20" />
							</div>

							<!-- 中间提示文本 -->
							<div class="flex-1 text-center">
								<p class="text-sm text-white flex items-center justify-center">
									<span class="text-red-400">*</span> 为必填项，其他为选填项
								</p>
							</div>

							<!-- 右侧按钮 -->
							<div class="flex-shrink-0">
								<button v-if="currentStep !== 'experience'" :disabled="saving" class="neon-button px-6 py-3"
									@click="nextStep">
									下一步
									<i class="ri-arrow-right-line ml-2" />
								</button>
								<button v-else :disabled="saving" class="neon-button px-6 py-3" @click="finishProfile">
									<i v-if="saving" class="ri-loader-4-line animate-spin mr-2" />
									{{ saving ? '保存中...' : '完成' }}
									<i v-if="!saving" class="ri-check-line ml-2" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 技能标签选择器 -->
		<SkillTagSelector v-model:visible="showSkillTagSelector" v-model="selectedSkillTags"
			@confirm="handleSkillTagConfirm" />
	</div>
</template>

<style scoped>
@import '@/styles/talent.css';

.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 主色调 */
.bg-primary {
  background: linear-gradient(45deg, #007AFF, #AF52DE);
}

.text-primary {
  color: #0a84ff;
}

.text-secondary {
  color: #bf5af2;
}

/* 输入框聚焦效果 */
.glow-input:focus {
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5);
}

/* 头像上传 */
.avatar-upload {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 4v16m8-8H4'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
}

/* 自定义滑块 */
.custom-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(99, 99, 102, 0.3);
  border-radius: 3px;
  outline: none;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(90deg, #007AFF, #AF52DE);
  cursor: pointer;
}

.custom-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(90deg, #007AFF, #AF52DE);
  cursor: pointer;
  border: none;
}

/* 按钮样式 */
.rounded-button {
  border-radius: 8px;
}

.secondary-button {
  @apply px-4 py-2 bg-transparent border border-gray-600 rounded text-gray-300;
  @apply hover:bg-gray-800 transition-colors;
}

.neon-button {
  @apply px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white font-medium;
  @apply hover:from-blue-500 hover:to-purple-500 transition-all;
}

/* 日期选择器自定义样式 */
.date-input {
  color-scheme: dark;
  position: relative;
}

/* 自定义日历图标 */
.date-input::before {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
  pointer-events: none;
  z-index: 1;
}

/* 当有清空按钮时，调整日历图标位置 */
.date-input.has-clear-button::before {
  right: 40px;
}

.date-input.has-clear-button {
  padding-right: 36px;
}

/* 原生日期选择器样式 */
.date-input::-webkit-calendar-picker-indicator {
  opacity: 1;
  background: transparent;
  color: transparent;
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

/* 当有清空按钮时，调整日历选择器位置 */
.date-input.has-clear-button::-webkit-calendar-picker-indicator {
  right: 36px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义复选框样式 */
input[type="checkbox"] {
  accent-color: #0a84ff;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.3);
}

.social-link-input {
  transition: all 0.2s ease;
}
.social-link-input:focus {
  border-color: #0a84ff;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2);
}
.social-remove-btn {
  transition: all 0.2s ease;
}
.social-remove-btn:hover {
  transform: scale(1.1);
}
</style>
