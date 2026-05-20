import { ResearchReport } from '../types/report'

export function getReadIds(): string[] {
  try {
    const stored = localStorage.getItem('research-os-read-report-ids')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isUnread(id: string, readIds: string[]): boolean {
  return !readIds.includes(id)
}
