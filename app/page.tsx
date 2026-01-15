'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Zap, AlertCircle, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 导航栏 - 玻璃态 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="container-max flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Sparkles size={28} className="text-primary" />
            周报翻译器
          </div>
          <div className="flex gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-primary font-medium transition-colors">
              定价
            </Link>
            <Link href="/generate" className="btn-primary">
              立即生成
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero 区域 - 现代渐变背景 */}
      <section className="relative container-max py-24 md:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center max-w-3xl mx-auto animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6 leading-tight">
            高效生成专业周报
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            将工作内容结构化转换为专业周报，让工作成果清晰可见，提升职场竞争力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/generate" className="btn-primary flex items-center justify-center gap-2 glow-effect">
              立即体验
              <ArrowRight size={20} />
            </Link>
            <button className="btn-secondary">查看示例</button>
          </div>
          <p className="text-sm text-gray-500">
            数据不保存 • 支持一键清空 • 支持 Markdown 导出
          </p>
        </div>
      </section>

      {/* 价值点区域 */}
      <section className="py-24 border-t border-white/20">
        <div className="container-max">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            为什么选择周报翻译器
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-primary" size={32} />,
                title: '快速生成',
                desc: '3 秒内将工作内容转换为专业周报，节省大量时间。',
              },
              {
                icon: <CheckCircle2 className="text-primary" size={32} />,
                title: '结构清晰',
                desc: '自动补齐关键信息，确保周报内容完整、逻辑清晰。',
              },
              {
                icon: <AlertCircle className="text-primary" size={32} />,
                title: '风险管理',
                desc: '自动生成风险说明和依赖项，规避职场风险。',
              },
            ].map((item, i) => (
              <div key={i} className="card p-8 card-3d group hover:shadow-glow">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 对比示例 */}
          <div className="mt-16 card p-8 card-3d">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-red-50/50 border border-red-100/50">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-red-600 text-xl">✕</span> 传统周报
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 修复登录 Bug</li>
                  <li>• 对齐需求</li>
                  <li>• 推进上线</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span> 专业周报
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  定位并修复登录失败根因，降低相关工单；完成需求对齐与排期确认，确保按期上线。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 屏3: 功能特性 */}
      <section className="container-max py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
          专业的模板和选项
        </h2>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">6 种岗位模板</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 通用周报
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 产品经理
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 运营/增长
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 研发
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 项目管理
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 销售支持
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">灵活的输出选项</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 3 种输出风格（稳重、强结果、强协作）
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 3 种输出长度（短、中、长）
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 支持复制和 Markdown 导出
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-700">•</span> 可选登录保存历史记录
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <Link href="/generate" className="btn-primary inline-flex items-center gap-2">
            开始使用
            <ArrowRight size={20} />
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
