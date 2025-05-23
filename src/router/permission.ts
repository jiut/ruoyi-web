// 直接使用 any 避免多版本 vue-router 类型冲突

const whiteList = ['/login', '/regist','/resetpassword']; // 不重定向白名单

export function setupPageGuard(router: any) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    // 检查浏览器语言
    // const browserLanguage = navigator.language || navigator.language;
    // const isChineseLanguage = browserLanguage.includes('zh');
    // const isInChina = ref(false);
    // const response = await fetch('http://ip-api.com/json/');
    // const data = await response.json();
    // isInChina.value = data.countryCode === 'CN';
    // console.log("isInChina", isInChina.value,isChineseLanguage)
    // // 中国大陆的国家代码为 "CN"
    // if (isChineseLanguage && isInChina.value) {
    //   alert("该网站不支持大陆ip")
    //   // 如果是中文环境，则重定向到 zh.html
    //   window.location.href = '/index.htm';
    // } else {
    //     next();
    //     console.log("next===")
    // }
		next();

  });
}
