import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '周报翻译器 - 把忙碌变成绩效',
  description: '3秒生成结果导向的周报，让领导看得懂、看了想夸。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
