import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  name: string
  userBalance: number
  userGrade: string
  userName: string
  userId?: string | number // 添加userId字段
  phone?: string // 添加手机号字段
  roles?: Array<{
    roleId: string
    roleName: string
    roleKey: string
  }>
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: 'https://avatars.githubusercontent.com/u/32251822?v=4',
      name: '熊猫助手',
      userBalance: 0,
      userGrade: '0',
      userName: '',
      userId: undefined, // 添加userId字段
      phone: undefined, // 添加手机号字段
      roles: [],
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
