'use client'

import Link from 'next/link'
import { Check, X, Sparkles, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '¥0',
    period: '永久免费',
    description: '试用版',
    features: [
      { name: '每日生成次数', value: '3 次/天', included: true },
      { name: '通用周报模板', value: '✓', included: true },
      { name: '岗位模板', value: '✗', included: false },
      { name: '输出风格切换', value: '仅稳重', included: true },
      { name: '输出长度', value: '短', included: true },
      { name: '关键结果强化', value: '基础', included: true },
      { name: '风险&依赖模块', value: '✗', included: false },
      { name: '绩效自评模板', value: '✗', included: false },
      { name: '导出', value: '复制', included: true },
      { name: '历史记录', value: '✗', included: false },
      { name: '隐私控制', value: '✓', included: true },
    ],
    cta: '免费开始',
    ctaLink: '/generate',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '¥19',
    period: '/月 或 ¥99/年',
    description: '周报稳定高分',
    features: [
      { name: '每日生成次数', value: '不限', included: true },
      { name: '通用周报模板', value: '✓', included: true },
      { name: '岗位模板', value: '✓', included: true },
      { name: '输出风格切换', value: '✓', included: true },
      { name: '输出长度', value: '✓', included: true },
      { name: '关键结果强化', value: '✓', included: true },
      { name: '风险&依赖模块', value: '✓', included: true },
      { name: '绩效自评模板', value: '✗', included: false },
      { name: '导出', value: '复制 + Markdown', included: true },
      { name: '历史记录', value: '✓', included: true },
      { name: '隐私控制', value: '✓', included: true },
    ],
    cta: '升级到 Pro',
    ctaLink: '#payment',
    highlighted: true,
  },
  {
    name: 'Pro+',
    price: '¥39',
    period: '/月 或 ¥199/年',
    description: '年终绩效不熬夜',
    features: [
      { name: '每日生成次数', value: '不限', included: true },
      { name: '通用周报模板', value: '✓', included: true },
      { name: '岗位模板', value: '✓', included: true },
      { name: '输出风格切换', value: '✓ + 冲KPI', included: true },
      { name: '输出长度', value: '✓', included: true },
      { name: '关键结果强化', value: '✓ + 自评口径', included: true },
      { name: '风险&依赖模块', value: '✓', included: true },
      { name: '绩效自评模板', value: '✓', included: true },
      { name: '导出', value: '复制 + Markdown + Word/PDF', included: true },
      { name: '历史记录', value: '✓', included: true },
      { name: '隐私控制', value: '✓', included: true },
    ],
    cta: '升级到 Pro+',
    ctaLink: '#payment',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 导航栏 - 玻璃态 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="container-max flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Sparkles size={28} className="text-primary" />
            周报翻译器
          </div>
          <Link href="/generate" className="btn-primary">
            立即生成
          </Link>
        </div>
      </nav>

      {/* 标题 */}
      <section className="container-max py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
          选择适合你的套餐
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          从免费试用开始，随时升级获得更多功能。不满意？7 天内可退。
        </p>
      </section>

      {/* 定价表 */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`card rounded-2xl overflow-hidden transition-all card-3d ${
                plan.highlighted
                  ? 'ring-2 ring-primary shadow-glow scale-105 bg-gradient-to-br from-primary/5 to-secondary/5'
                  : 'bg-white/80 hover:shadow-glow'
              }`}
            >
              {/* 计划头 */}
              <div className={`p-8 ${plan.highlighted ? 'bg-gradient-primary text-white' : 'bg-white/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.highlighted && <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">✨ 推荐</span>}
                </div>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ml-2 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                </div>
                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:shadow-glow'
                      : 'bg-gradient-primary text-white hover:shadow-glow'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* 功能列表 */}
              <div className="p-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    ) : (
                      <X className="text-gray-300 flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">{feature.name}</div>
                      <div className={`font-semibold ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                        {feature.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-max py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gradient">常见问题</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              q: '可以免费试用吗？',
              a: '当然可以！Free 套餐永久免费，每天可生成 3 次周报。',
            },
            {
              q: '支持哪些支付方式？',
              a: '支持微信支付和支付宝，安全便捷。',
            },
            {
              q: '可以取消订阅吗？',
              a: '随时可以取消。如果不满意，7 天内可申请退款。',
            },
            {
              q: '数据会被保存吗？',
              a: '默认不保存。登录后可选择保存历史记录，方便下次使用。',
            },
            {
              q: '支持导出为 Word 吗？',
              a: 'Pro+ 套餐支持导出为 Word 和 PDF。',
            },
            {
              q: '如何获得更多帮助？',
              a: '联系我们的客服团队，邮箱：support@zhoubao.com',
            },
          ].map((item, i) => (
            <div key={i} className="card p-6 card-3d">
              <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 支付占位 */}
      <section id="payment" className="container-max py-16 text-center">
        <div className="card p-12 card-3d bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30">
          <h3 className="text-2xl font-bold text-gradient mb-4">支付功能开发中</h3>
          <p className="text-gray-600 mb-6">
            我们正在集成微信支付和支付宝。敬请期待！
          </p>
          <Link href="/generate" className="btn-primary inline-flex items-center gap-2">
            先试试免费版本
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 mt-20 border-t border-gray-800">
        <div className="container-max text-center">
          <p className="text-gray-400">© 2024 周报翻译器. 让工作成果清晰可见。</p>
        </div>
      </footer>
    </main>
  )
}
