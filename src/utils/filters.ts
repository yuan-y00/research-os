import { ResearchReport } from '../types/report'

export function filterReports(
  reports: ResearchReport[],
  filters: { type?: string; category?: string; unread?: boolean },
  readIds: string[]
): ResearchReport[] {
  return reports.filter(r => {
    if (filters.type && r.type !== filters.type) return false
    if (filters.category && r.category !== filters.category) return false
    if (filters.unread && readIds.includes(r.id)) return false
    return true
  })
}

export function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    brand: '品牌',
    founder: '创始人',
    product: '产品',
    company: '公司',
    crowdfunding: '众筹',
    industry_event: '行业事件',
  }
  return map[type] || type
}
