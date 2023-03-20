import { Task, TaskStatus } from '@/types/task-type'

export function validateTitle(title: string) {
  if (title.length < 1) {
    return true
  } else {
    return false
  }
}

export function validateBody(body: string) {
  if (body.length < 30) {
    return true
  } else {
    return false
  }
}

export function extractStatusAndContent(body: string): {
  status: TaskStatus | undefined
  content: string
} {
  const regex = /^(Open|In Progress|Done): \s*(.*)$/
  const match = body.match(regex)

  if (match) {
    return { status: match[1] as TaskStatus, content: match[2] }
  } else {
    return { status: undefined, content: body }
  }
}

export async function handelAllTaskFetchResponse(
  response: Response
): Promise<Task[]> {
  return (await response.json()).map((task: Task) => {
    const { content, status } = extractStatusAndContent(task.body)
    return {
      ...task,
      body: content,
      status: status, 
    }
  })
}

export async function handelTaskFetchResponse(
  response: Response
): Promise<Task> {
  const task = await response.json()
  const { content, status } = extractStatusAndContent(task.body)

  return {
    ...task,
    body: content,
    status: status,
  }
}
