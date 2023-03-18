type label = {
  id: number
  node_id: string
  name: string
  description: string
  color_code: string
  url: string
  default: boolean
}

export interface Task {
  created_at: Date
  // owner: string
  // repo: string
  number: number
  title: string
  body: string
  // assignee?: string | null
  state: 'open' | 'closed'
  // state_reason?: 'completed' | 'not_planned' | 'reopened' | null
  // milestone?: string | number | null
  labels?: label[]
  // assignees?: string[]
}
