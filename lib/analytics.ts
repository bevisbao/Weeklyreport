// 埋点事件定义
export const EVENTS = {
  // 页面访问
  PAGE_VIEW: 'page_view',

  // 首页
  HOME_HERO_CTA: 'home_hero_cta',
  HOME_EXAMPLE_VIEW: 'home_example_view',
  HOME_PRICING_CLICK: 'home_pricing_click',

  // 生成页
  GENERATE_TEMPLATE_SELECT: 'generate_template_select',
  GENERATE_PASTE_MODE: 'generate_paste_mode',
  GENERATE_SUBMIT: 'generate_submit',
  GENERATE_SUCCESS: 'generate_success',
  GENERATE_ERROR: 'generate_error',
  GENERATE_COPY: 'generate_copy',
  GENERATE_EXPORT: 'generate_export',
  GENERATE_CLEAR: 'generate_clear',

  // 付费页
  PRICING_VIEW: 'pricing_view',
  PRICING_PLAN_SELECT: 'pricing_plan_select',
  PRICING_PAYMENT_CLICK: 'pricing_payment_click',

  // 用户
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',

  // 支付
  PAYMENT_START: 'payment_start',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_ERROR: 'payment_error',
}

// 埋点函数
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties)
    }

    // 本地日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${eventName}`, properties)
    }
  }
}

// 页面访问追踪
export function trackPageView(path: string) {
  trackEvent(EVENTS.PAGE_VIEW, {
    page_path: path,
    page_title: document.title,
  })
}
