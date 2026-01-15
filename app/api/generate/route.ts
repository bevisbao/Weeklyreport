import { NextRequest, NextResponse } from 'next/server'
import { generateWeeklyReport, generateComparisonReport } from '@/lib/openai'
import { GenerateRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest & { comparison?: boolean } = await request.json()

    // 验证必填字段
    if (!body.template || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 如果是对比模式，调用对比生成函数
    if (body.comparison) {
      const result = await generateComparisonReport(body)
      return NextResponse.json(result)
    }

    // 否则调用普通生成函数
    const result = await generateWeeklyReport(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    )
  }
}
