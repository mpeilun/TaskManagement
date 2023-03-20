type Label = {
  id: number
  node_id: string
  name: string
  description: string
  color_code: string
  url: string
  default: boolean
}

type UserInfo = {
  avatar_url: string
  html_url: string
  id: string
  login: string
}

export interface Task {
  created_at: string
  user: UserInfo
  // repo: string
  number: number
  title: string
  body: string
  // assignee?: string | null
  state: 'open' | 'closed'
  // state_reason?: 'completed' | 'not_planned' | 'reopened' | null
  // milestone?: string | number | null
  labels?: Label[]
  status: TaskStatus
  // assignees?: string[]
}

export type TaskStatus = 'Open' | 'In Progress' | 'Done' | undefined
