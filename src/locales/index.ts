import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from './en-US'
import koKR from './ko-KR'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import ruRU from './ru-RU'
import viVn from './vi-VN'
import frFr from './fr-FR'
import trTr from './tr-TR'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { Language } from '@/store/modules/app/helper'

let defaultLocale = 'zh-CN'

try {
  const appStore = useAppStoreWithOut()
  defaultLocale = appStore.language || 'zh-CN'
}
catch (error) {
  console.warn('Unable to access app store during i18n initialization, using default locale')
}

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages: {
    'en-US': enUS,
    'ko-KR': koKR,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'ru-RU': ruRU,
    'vi-VN': viVn,
    'fr-FR': frFr,
    'tr-TR': trTr,
  },
})

export const t = i18n.global.t

export function setLocale(locale: Language) {
  i18n.global.locale.value = locale
}

export function setupI18n(app: App) {
  app.use(i18n)
}

export default i18n
