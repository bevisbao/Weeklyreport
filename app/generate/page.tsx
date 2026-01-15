'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { Copy, Download, Trash2, Plus, Loader } from 'lucide-react'
import { GenerateRequest, WeeklyItem, TemplateType, OutputStyle, OutputLength, ReportType } from '@/types'

const TEMPLATES = {
  general: { name: '通用周报', desc: '适用于所有岗位' },
  pm: { name: '产品经理', desc: 'PM专用模板' },
  ops: { name: '运营/增长', desc: '运营、市场、增长' },
  dev: { name: '研发', desc: '前端、后端、全栈' },
  project: { name: '项目管理', desc: 'PMO、项目经理' },
  sales: { name: '销售支持', desc: 'CS、售前、交付' },
}

export default function GeneratePage() {
  const [template, setTemplate] = useState<TemplateType>('general')
  const [items, setItems] = useState<WeeklyItem[]>([{ id: '1', task: '' }])
  const [risks, setRisks] = useState('')
  const [support, setSupport] = useState('')
  const [nextWeek, setNextWeek] = useState([''])
  const [style, setStyle] = useState<OutputStyle>('stable')
  const [length, setLength] = useState<OutputLength>('medium')
  const [projectName, setProjectName] = useState('')
  const [metrics, setMetrics] = useState('')
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [reportType, setReportType] = useState<ReportType>('weekly')

  // 初始化：检查使用次数和对比模式
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const count = parseInt(localStorage.getItem('weeklyReportUsageCount') || '0', 10)
      setUsageCount(count)
      // 首次使用或使用次数少于3次时启用对比模式
      setComparisonMode(count < 3)
    }
  }, [])

  const addItem = useCallback(() => {
    setItems([...items, { id: Date.now().toString(), task: '' }])
  }, [items])

  const updateItem = useCallback((id: string, field: string, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }, [items])

  const removeItem = useCallback((id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }, [items])

  const addNextWeekItem = useCallback(() => {
    setNextWeek([...nextWeek, ''])
  }, [nextWeek])

  const updateNextWeekItem = useCallback((index: number, value: string) => {
    const newNextWeek = [...nextWeek]
    newNextWeek[index] = value
    setNextWeek(newNextWeek)
  }, [nextWeek])

  const removeNextWeekItem = useCallback((index: number) => {
    if (nextWeek.length > 1) {
      setNextWeek(nextWeek.filter((_, i) => i !== index))
    }
  }, [nextWeek])

  const handlePasteItems = useCallback(() => {
    if (!pasteText.trim()) return

    const lines = pasteText
      .split('\n')
      .filter((line) => line.trim())
      .map((line, i) => ({
        id: `paste-${i}`,
        task: line.trim(),
      }))

    if (lines.length > 0) {
      setItems(lines)
      setPasteMode(false)
      setPasteText('')
    }
  }, [pasteText])

  const handleGenerate = async () => {
    if (items.some((item) => !item.task.trim())) {
      setError('请填写所有事项')
      return
    }

    setLoading(true)
    setError('')

    try {
      const request: GenerateRequest & { comparison?: boolean } = {
        template,
        items: items.filter((item) => item.task.trim()),
        risks: risks.trim(),
        support: support.trim(),
        nextWeek: nextWeek.filter((item) => item.trim()),
        style,
        length,
        projectName: projectName.trim(),
        metrics: metrics.trim(),
        reportType,
        comparison: comparisonMode,
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()
      setResult(data)

      // 更新使用次数
      if (typeof window !== 'undefined') {
        const newCount = usageCount + 1
        localStorage.setItem('weeklyReportUsageCount', newCount.toString())
        setUsageCount(newCount)
      }

      trackEvent('generate_success', { template, style, length, reportType, comparisonMode })
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试')
      trackEvent('generate_error', { template })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    let text = ''
    if (comparisonMode && result.free && result.pro) {
      text = `【免费版】\n${Object.values(result.free).join('\n\n')}\n\n【Pro版】\n${Object.values(result.pro).join('\n\n')}`
    } else {
      text = Object.values(result).join('\n\n')
    }
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent('copy_result', { template, comparisonMode })
  }

  const handleExport = () => {
    let text = ''
    if (comparisonMode && result.free && result.pro) {
      text = `# 周报对比\n\n## 免费版\n${Object.values(result.free).join('\n\n')}\n\n## Pro版\n${Object.values(result.pro).join('\n\n')}`
    } else {
      text = Object.values(result).join('\n\n')
    }
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `周报-${new Date().toISOString().split('T')[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
    trackEvent('export_result', { template, comparisonMode })
  }

  const handleClear = () => {
    setItems([{ id: '1', task: '' }])
    setRisks('')
    setSupport('')
    setNextWeek([''])
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-max py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            周报翻译器
          </Link>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <Trash2 size={18} />
            清空
          </button>
        </div>
      </nav>

      <div className="container-max py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：输入区 */}
          <div className="space-y-6">
            {/* 报告类型选择 */}
            <div>
              <h3 className="form-label">选择报告类型</h3>
              <div className="flex gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      reportType === type
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    {type === 'daily' ? '📅 日报' : type === 'weekly' ? '📊 周报' : '📈 月报'}
                  </button>
                ))}
              </div>
            </div>

            {/* 模板选择 */}
            <div>
              <h3 className="form-label">选择模板</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TEMPLATES).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setTemplate(key as TemplateType)}
                    className={`p-4 rounded-xl border-2 transition-all text-left card-3d group ${
                      template === key
                        ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-glow'
                        : 'border-gray-200/50 bg-white/50 hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{value.name}</div>
                    <div className="text-sm text-gray-600">{value.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 本周事项 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="form-label mb-0">本周事项</h3>
                <button
                  onClick={() => setPasteMode(!pasteMode)}
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  {pasteMode ? '返回' : '批量粘贴'}
                </button>
              </div>

              {pasteMode ? (
                <div className="space-y-3">
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="每行一条事项，粘贴后自动拆分"
                    className="form-input h-32"
                  />
                  <button
                    onClick={handlePasteItems}
                    className="btn-primary w-full"
                  >
                    导入事项
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <input
                        type="text"
                        value={item.task}
                        onChange={(e) => updateItem(item.id, 'task', e.target.value)}
                        placeholder={`事项 ${index + 1}`}
                        className="form-input"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.output || ''}
                          onChange={(e) => updateItem(item.id, 'output', e.target.value)}
                          placeholder="产出物（可选）"
                          className="form-input text-sm"
                        />
                        <input
                          type="text"
                          value={item.data || ''}
                          onChange={(e) => updateItem(item.id, 'data', e.target.value)}
                          placeholder="数据（可选）"
                          className="form-input text-sm"
                        />
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addItem}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus size={18} />
                    添加事项
                  </button>
                </div>
              )}
            </div>

            {/* 难点与风险 */}
            <div>
              <label className="form-label">难点与风险（可选）</label>
              <textarea
                value={risks}
                onChange={(e) => setRisks(e.target.value)}
                placeholder="描述本周遇到的难点或风险"
                className="form-input h-24"
              />
            </div>

            {/* 需要支持 */}
            <div>
              <label className="form-label">需要支持（可选）</label>
              <textarea
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                placeholder="描述需要的支持或资源"
                className="form-input h-24"
              />
            </div>

            {/* 下周计划 */}
            <div>
              <h3 className="form-label">下周计划</h3>
              <div className="space-y-2">
                {nextWeek.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateNextWeekItem(index, e.target.value)}
                      placeholder={`计划 ${index + 1}`}
                      className="form-input flex-1"
                    />
                    {nextWeek.length > 1 && (
                      <button
                        onClick={() => removeNextWeekItem(index)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addNextWeekItem}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={18} />
                  添加计划
                </button>
              </div>
            </div>

            {/* 输出选项 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">输出风格</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as OutputStyle)}
                  className="form-input"
                >
                  <option value="stable">稳重</option>
                  <option value="result">强结果</option>
                  <option value="collaboration">强协作</option>
                </select>
              </div>
              <div>
                <label className="form-label">输出长度</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as OutputLength)}
                  className="form-input"
                >
                  <option value="short">短</option>
                  <option value="medium">中</option>
                  <option value="long">长</option>
                </select>
              </div>
            </div>

            {/* 可选字段 */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="项目/需求名称（可选）"
                className="form-input"
              />
              <input
                type="text"
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                placeholder="关键指标（可选）"
                className="form-input"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  生成中...
                </>
              ) : (
                '立即生成周报'
              )}
            </button>
          </div>

          {/* 右侧：结果区 */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* 对比模式 */}
                {comparisonMode && result.free && result.pro ? (
                  <>
                    {/* 对比模式顶部按钮 */}
                    <div className="card p-6 space-y-4 sticky top-24">
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                          <Copy size={18} />
                          {copied ? '已复制' : '复制'}
                        </button>
                        <button
                          onClick={handleExport}
                          className="flex-1 btn-secondary flex items-center justify-center gap-2"
                        >
                          <Download size={18} />
                          导出 MD
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        已为你生成免费版和 Pro 版对比，体验差异后可升级
                      </p>
                    </div>

                    {/* 双栏对比展示 */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* 免费版 */}
                      <div className="card p-6 bg-gray-50/50 border-2 border-gray-200/50 card-3d">
                        <div className="mb-4 pb-4 border-b-2 border-gray-200/50">
                          <h3 className="text-lg font-bold text-gray-700">免费版</h3>
                          <p className="text-xs text-gray-500 mt-1">基础功能</p>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {Object.entries(result.free).map(([key, value]: [string, any]) => (
                            <div key={key}>
                              <h4 className="font-semibold text-gray-700 mb-2 capitalize text-sm">
                                {key}
                              </h4>
                              <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-wrap">
                                {String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setResult(null)}
                          className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300/50 rounded-lg hover:bg-white/50 transition-all"
                        >
                          重新生成
                        </button>
                      </div>

                      {/* Pro版 */}
                      <div className="card p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30 card-3d glow-effect relative">
                        <div className="absolute top-0 right-0 bg-gradient-primary text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                          ✨ Pro
                        </div>
                        <div className="mb-4 pb-4 border-b-2 border-primary/20">
                          <h3 className="text-lg font-bold text-primary">Pro 版</h3>
                          <p className="text-xs text-primary/60 mt-1">完整功能 • 更详细 • 更专业</p>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {Object.entries(result.pro).map(([key, value]: [string, any]) => (
                            <div key={key}>
                              <h4 className="font-semibold text-primary mb-2 capitalize text-sm">
                                {key}
                              </h4>
                              <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                                {String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/pricing"
                          className="w-full mt-4 py-2 text-sm font-semibold text-white bg-gradient-primary hover:shadow-glow rounded-lg text-center block transition-all"
                        >
                          升级 Pro • 仅需 ¥19/月
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  // 普通模式
                  <div className="card p-8 space-y-6 sticky top-24">
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                      >
                        <Copy size={18} />
                        {copied ? '已复制' : '复制'}
                      </button>
                      <button
                        onClick={handleExport}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        导出 MD
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(result).map(([key, value]: [string, any]) => (
                        <div key={key}>
                          <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                            {key}
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setResult(null)}
                      className="btn-secondary w-full"
                    >
                      再生成一次
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center text-gray-500 sticky top-24">
                <p>填写左侧信息后，点击"立即生成周报"</p>
                {comparisonMode && usageCount < 3 && (
                  <p className="text-sm text-blue-600 mt-2">
                    💡 首次使用将为你生成免费版和 Pro 版对比（已使用 {usageCount}/3 次）
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }
}
