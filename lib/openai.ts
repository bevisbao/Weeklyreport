import { OpenAI } from 'openai'
import { GenerateRequest, GenerateResponse, ComparisonResponse, ReportType } from '@/types'

let openai: OpenAI | null = null

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not set')
    }

    const baseURL = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'

    openai = new OpenAI({
      apiKey,
      baseURL,
    })
  }
  return openai
}

const PROMPTS = {
  daily: {
    general: `你是一位专业的日报撰写顾问。请根据以下信息生成一份结构清晰、简洁的日报。

用户今日完成的事项：
{items}

遇到的问题与难点：{risks}
需要的支持：{support}
明日计划：{nextWeek}

请按照以下结构生成日报（使用{style}风格，{length}长度）：
1. 今日完成：总结今天完成的关键工作
2. 产出成果：今天的具体产出和价值
3. 问题与阻塞：遇到的问题及影响
4. 需要支持：需要的帮助和资源
5. 明日计划：明天的行动项

要求：
- 简洁明快，避免冗长描述
- 突出今天的具体产出
- 清晰列出阻塞项和需要的支持
- 为明天的工作做好准备`,

    pm: `你是产品经理的日报撰写专家。请根据以下信息生成一份简洁的产品日报。

今日完成：{items}
关键决策：{projectName}
关键指标：{metrics}
遇到的问题：{risks}
需要的支持：{support}
明日计划：{nextWeek}

请生成包含以下部分的日报（{style}风格，{length}长度）：
1. 今日完成：需求评审、原型设计、竞品分析等
2. 关键决策：今天做出的重要决策
3. 用户反馈：收集到的用户反馈和建议
4. 问题阻塞：遇到的技术/流程问题
5. 明日计划：需求完成、评审会议等

要求：
- 突出产品决策和进展
- 强调用户反馈和数据
- 清楚列出阻塞项`,

    ops: `你是运营/增长的日报撰写专家。请根据以下信息生成一份运营日报。

今日完成：{items}
活动/渠道：{projectName}
核心数据：{metrics}
遇到的问题：{risks}
需要的支持：{support}
明日计划：{nextWeek}

请生成包含以下部分的日报（{style}风格，{length}长度）：
1. 今日完成：活动执行、投放上线、数据分析等
2. 实时数据：DAU、转化率、ROI等核心指标
3. A/B测试：今日运行的测试结果
4. 问题阻塞：数据异常、渠道问题等
5. 明日计划：投放优化、测试调整等

要求：
- 突出数据和实时表现
- 强调ROI和转化指标
- 清晰说明待解决问题`,

    dev: `你是研发的日报撰写专家。请根据以下信息生成一份技术日报。

今日完成：{items}
需求/版本：{projectName}
质量指标：{metrics}
技术问题：{risks}
需要的支持：{support}
明日计划：{nextWeek}

请生成包含以下部分的日报（{style}风格，{length}长度）：
1. 代码提交：完成的功能开发、Bug修复数量
2. Code Review：完成的代码审查情况
3. 单元测试：新增/完善的测试
4. 技术阻塞：遇到的技术难题、依赖问题
5. 明日计划：继续开发、代码提交等

要求：
- 突出代码交付和质量指标
- 强调测试覆盖率和代码审查
- 清楚列出技术阻塞`,

    project: `你是项目经理的日报撰写专家。请根据以下信息生成一份项目日报。

今日完成：{items}
项目阶段：{projectName}
里程碑进度：{metrics}
问题与阻塞：{risks}
需要支持：{support}
明日计划：{nextWeek}

请生成包含以下部分的日报（{style}风格，{length}长度）：
1. 今日进度：完成的工作节点和里程碑
2. 团队状态：团队协作和资源利用情况
3. 关键路径：关键路径上的进展
4. 风险阻塞：依赖延迟、资源不足等
5. 明日重点：明天的关键任务

要求：
- 突出里程碑进度
- 强调风险管理和阻塞清理
- 清晰说明团队状态`,

    sales: `你是销售支持/客户成功的日报撰写专家。请根据以下信息生成一份日报。

今日完成：{items}
客户/行业：{projectName}
服务指标：{metrics}
问题与风险：{risks}
需要支持：{support}
明日计划：{nextWeek}

请生成包含以下部分的日报（{style}风格，{length}长度）：
1. 客户跟进：今天跟进的客户数和问题处理
2. 问题处理：工单完成、问题解决情况
3. 客户反馈：收集到的客户建议和反馈
4. 风险预警：续约风险、投诉等
5. 明日计划：客户会议、问题跟进等

要求：
- 突出客户价值和服务质量
- 强调问题解决率
- 清晰说明风险预警`,
  },

  weekly: {
    general: `你是一位专业的周报撰写顾问。请根据以下信息生成一份结构清晰、结果导向的周报。

用户输入的本周事项：
{items}

难点与风险：{risks}
需要支持：{support}
下周计划：{nextWeek}

请按照以下结构生成周报（使用{style}风格，{length}长度）：
1. 本周进展：总结本周完成的关键工作
2. 关键结果：突出产出和价值
3. 协作与推动：说明跨团队协作
4. 风险与依赖：列出风险和需要的支持
5. 下周计划：明确下周的行动项

要求：
- 使用结果导向的表达方式
- 突出数据和具体产出
- 避免流水账式的描述
- 体现专业性和执行力`,

    pm: `你是产品经理的周报撰写专家。请根据以下信息生成一份专业的产品周报。

本周事项：{items}
项目/需求名称：{projectName}
关键指标：{metrics}
难点与风险：{risks}
需要支持：{support}
下周计划：{nextWeek}

请生成包含以下部分的周报（{style}风格，{length}长度）：
1. 本周进展：PRD编写、需求评审、原型设计、竞品分析等
2. 关键结果：沉淀的产出物和重要决策
3. 用户研究：用户反馈、数据分析、竞品动态
4. 风险与依赖：技术风险、资源依赖、利益相关者反馈
5. 下周计划：需求排期、评审会议、灰度测试等

要求：
- 突出产品决策和产出
- 体现数据驱动和用户价值
- 强调竞品分析和用户研究`,

    ops: `你是运营/增长的周报撰写专家。请根据以下信息生成一份专业的运营周报。

本周事项：{items}
活动/渠道：{projectName}
核心数据：{metrics}
难点与风险：{risks}
需要支持：{support}
下周计划：{nextWeek}

请生成包含以下部分的周报（{style}风格，{length}长度）：
1. 本周关键产出：活动上线、投放执行、优化调整
2. 数据表现：DAU/MAU、转化率、ROI、获客成本等
3. 方法沉淀：可复用的经验、最佳实践、标准化模板
4. 风险与阻塞：数据异常、渠道问题、资源约束
5. 下周计划：扩量策略、新渠道测试、复盘会议

要求：
- 突出数据和ROI
- 体现增长思维
- 强调可复用的方法和经验沉淀`,

    dev: `你是研发的周报撰写专家。请根据以下信息生成一份专业的技术周报。

本周事项：{items}
版本号/需求：{projectName}
稳定性指标：{metrics}
难点与风险：{risks}
需要支持：{support}
下周计划：{nextWeek}

请生成包含以下部分的周报（{style}风格，{length}长度）：
1. 交付与变更：Bug修复数、功能开发、重构、技术优化
2. 质量效果：单元测试覆盖率、Code Review、性能提升数据
3. 风险与应对：灰度风险、监控告警、应急预案、依赖问题
4. 技术债：需要补齐的测试、文档、优化、基础设施
5. 下周计划：全量发布、补齐测试、文档完善、性能优化

要求：
- 突出技术成果和质量指标
- 体现稳定性和质量意识
- 强调风险管理和技术债清理`,

    project: `你是项目经理的周报撰写专家。请根据以下信息生成一份专业的项目周报。

本周完成：{items}
项目阶段：{projectName}
里程碑：{metrics}
问题与阻塞：{risks}
需要支持：{support}
下周里程碑：{nextWeek}

请生成包含以下部分的周报（{style}风格，{length}长度）：
1. 项目进度：本周完成的关键节点、交付物
2. 里程碑达成：对标计划的进展、偏差说明
3. 团队与资源：资源利用率、团队状态、成本控制
4. 风险与阻塞：依赖延迟、资源不足、质量问题
5. 下周计划：下一阶段的关键节点、重点任务

要求：
- 突出进度和里程碑
- 体现风险管理
- 强调团队协调和资源优化`,

    sales: `你是销售支持/客户成功的周报撰写专家。请根据以下信息生成一份专业的客户支持周报。

本周事项：{items}
客户/行业：{projectName}
交付数据：{metrics}
难点与风险：{risks}
需要支持：{support}
下周计划：{nextWeek}

请生成包含以下部分的周报（{style}风格，{length}长度）：
1. 客户支持与推进：方案答疑、问题闭环、客户培训
2. 服务指标：工单处理数、响应时间、满意度评分、续约率
3. 沉淀与复用：FAQ更新、案例库、标准话术、知识库
4. 风险与机会：续费风险、投诉处理、扩展机会
5. 下周计划：客户培训、沉淀材料、风险跟进、扩展推进

要求：
- 突出客户价值
- 体现服务质量
- 强调沉淀和复用`,
  },

  monthly: {
    general: `你是一位专业的月报撰写顾问。请根据以下信息生成一份结构完整、总结性的月报。

用户输入的本月事项：
{items}

难点与风险：{risks}
需要支持：{support}
下月计划：{nextWeek}

请按照以下结构生成月报（使用{style}风格，{length}长度）：
1. 本月总结：总结本月完成的关键工作和成果
2. 关键成果：突出本月的重大产出和价值贡献
3. 经验沉淀：总结的方法论和最佳实践
4. 问题与风险：梳理本月的风险和需要改进的地方
5. 下月目标：明确下月的重点目标和行动

要求：
- 使用总结性和战略性的表达方式
- 突出月度成果和战略意义
- 提炼经验和教训
- 体现战略眼光`,

    pm: `你是产品经理的月报撰写专家。请根据以下信息生成一份专业的产品月报。

本月事项：{items}
产品：{projectName}
关键指标：{metrics}
挑战与风险：{risks}
需要支持：{support}
下月计划：{nextWeek}

请生成包含以下部分的月报（{style}风格，{length}长度）：
1. 本月产品进展：需求排期完成情况、上线功能、迭代总结
2. 用户数据：用户增长、留存、满意度等关键指标
3. 竞品分析：竞品动态、市场变化、机会与威胁
4. 产品决策：本月做出的重要决策、市场调整
5. 下月重点：下月优先级、新功能规划、优化方向

要求：
- 突出产品迭代和增长数据
- 体现市场洞察和竞品分析
- 强调产品决策和战略方向`,

    ops: `你是运营/增长的月报撰写专家。请根据以下信息生成一份专业的运营月报。

本月事项：{items}
增长主题：{projectName}
核心数据：{metrics}
挑战与风险：{risks}
需要支持：{support}
下月计划：{nextWeek}

请生成包含以下部分的月报（{style}风格，{length}长度）：
1. 本月成果：活动成果、用户增长、收入贡献
2. 增长数据：DAU/MAU、新用户、留存率、生命周期价值
3. 渠道分析：各渠道表现、成本、效率对比
4. 增长方法：可复用的增长策略、经验沉淀、标准化流程
5. 下月规划：新增长机会、渠道拓展、策略调整

要求：
- 突出增长成果和数据
- 体现渠道分析和成本效率
- 强调可复用的增长方法`,

    dev: `你是研发的月报撰写专家。请根据以下信息生成一份专业的技术月报。

本月事项：{items}
版本迭代：{projectName}
质量指标：{metrics}
技术风险：{risks}
需要支持：{support}
下月计划：{nextWeek}

请生成包含以下部分的月报（{style}风格，{length}长度）：
1. 交付成果：发布的版本、Bug修复数、功能完成数
2. 质量与性能：测试覆盖率、线上问题率、性能指标、可用性
3. 技术债与优化：完成的技术债、架构优化、基础设施升级
4. 团队发展：技术分享、代码审查文化、新工具推进
5. 下月重点：性能优化方向、技术升级计划、人员培养

要求：
- 突出交付和质量指标
- 体现技术债清理和优化
- 强调团队能力建设`,

    project: `你是项目经理的月报撰写专家。请根据以下信息生成一份专业的项目月报。

本月完成：{items}
项目：{projectName}
里程碑进度：{metrics}
问题与阻塞：{risks}
需要支持：{support}
下月目标：{nextWeek}

请生成包含以下部分的月报（{style}风格，{length}长度）：
1. 项目进度：本月完成的交付物、里程碑达成情况
2. 资源与成本：资源利用率、成本控制、进度偏差
3. 风险管理：本月风险处理、质量问题解决、教训总结
4. 团队与协调：团队协作、跨部门配合、人员投入
5. 下月计划：下一阶段目标、重点任务、风险预案

要求：
- 突出项目进度和交付成果
- 体现成本意识和资源优化
- 强调风险管理和经验沉淀`,

    sales: `你是销售支持/客户成功的月报撰写专家。请根据以下信息生成一份专业的月报。

本月事项：{items}
客户群体：{projectName}
服务指标：{metrics}
问题与风险：{risks}
需要支持：{support}
下月计划：{nextWeek}

请生成包含以下部分的月报（{style}风格，{length}长度）：
1. 客户成功：新客户成功案例、客户增长、续约情况
2. 服务指标：工单处理数、响应时间、满意度、NPS评分
3. 知识沉淀：FAQ库更新、最佳实践、标准方案、案例库
4. 风险与机会：流失风险、投诉处理、扩展机会、市场反馈
5. 下月重点：重点客户培养、成功案例推进、风险预警

要求：
- 突出客户成功和满意度
- 体现知识沉淀和复用
- 强调客户价值和业务增长`,
  },
}

const STYLE_MODIFIERS = {
  stable: '使用稳重、专业的表达方式，强调稳定性和可靠性。',
  result: '使用结果导向的表达方式，突出成果和价值，强调"做了什么"和"产生了什么影响"。',
  collaboration: '使用强调协作的表达方式，突出团队合作、跨部门协调和推动力。',
}

const LENGTH_MODIFIERS = {
  short: '简洁版本，每部分控制在2-3句话。',
  medium: '标准版本，每部分控制在3-5句话。',
  long: '详细版本，每部分控制在5-8句话，包含更多细节和背景。',
}

export async function generateWeeklyReport(request: GenerateRequest): Promise<GenerateResponse> {
  const openaiClient = getOpenAIClient()
  const reportType: ReportType = request.reportType || 'weekly'
  const templatePrompt = PROMPTS[reportType][request.template]
  const styleModifier = STYLE_MODIFIERS[request.style]
  const lengthModifier = LENGTH_MODIFIERS[request.length]

  const itemsText = request.items
    .map((item) => `- ${item.task}${item.output ? `（产出：${item.output}）` : ''}${item.data ? `（数据：${item.data}）` : ''}`)
    .join('\n')

  const prompt = templatePrompt
    .replace('{items}', itemsText)
    .replace('{risks}', request.risks || '无')
    .replace('{support}', request.support || '无')
    .replace('{nextWeek}', request.nextWeek.join('、') || '待定')
    .replace('{projectName}', request.projectName || '通用项目')
    .replace('{metrics}', request.metrics || '无')
    .replace('{style}', request.style)
    .replace('{length}', request.length)

  const fullPrompt = `${prompt}\n\n${styleModifier}\n${lengthModifier}\n\n请直接输出报告内容，不需要额外说明。`

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'deepseek-r1',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content in response')
    }

    // 解析响应内容
    const sections = content.split(/\n(?=\d\.|本周|关键|协作|风险|下周)/)

    return {
      progress: sections[0] || '',
      keyResults: sections[1] || '',
      collaboration: sections[2] || '',
      risks: sections[3] || '',
      nextWeek: sections[4] || '',
    }
  } catch (error) {
    console.error('Error generating report:', error)
    throw error
  }
}

export async function generateComparisonReport(request: GenerateRequest): Promise<ComparisonResponse> {
  // 生成免费版（简洁版本）
  const freeRequest: GenerateRequest = {
    ...request,
    style: 'stable',
    length: 'short',
  }

  // 生成付费版（完整版本）- 增强下周计划的提示
  const proRequest: GenerateRequest = {
    ...request,
    style: 'result',
    length: 'long',
  }

  try {
    const [freeReport, proReport] = await Promise.all([
      generateWeeklyReport(freeRequest),
      generateWeeklyReport(proRequest),
    ])

    // 增强 Pro 版的下周计划部分，确保包含用户输入的具体计划
    if (request.nextWeek && request.nextWeek.length > 0) {
      const nextWeekDetails = request.nextWeek.join('；')
      proReport.nextWeek = `5. 下周计划：\n${request.nextWeek.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n这些计划将帮助我们继续推进项目进展，确保工作的连贯性和高效性。`
    }

    return {
      free: freeReport,
      pro: proReport,
    }
  } catch (error) {
    console.error('Error generating comparison report:', error)
    throw error
  }
}
