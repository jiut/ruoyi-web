// 声明全局 *.vue 模块，解决 TS 对 .vue 文件的类型报错
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

// Swiper v9 Modules 类型声明（若缺少）
declare module 'swiper/modules' {
  export * from 'swiper'
}
