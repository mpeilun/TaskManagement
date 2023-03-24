import { TaskStatus } from '@/types/task-type'
import { title } from 'process'

export async function addLabel(
  repo: string,
  repoSecret: string,
  label: TaskStatus,
  issueNumber: number
): Promise<Response> {
  console.log(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}/labels`
  )
  return await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}/labels`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${repoSecret}`,
      },
      body: JSON.stringify({
        labels: [label],
      }),
    }
  )
}

export async function searchIssue(
  repo: string,
  accessToken: string,
  perPage: number,
  nextPageNum: number
): Promise<Response> {
  const queries = [`order=desc`, `per_page=${perPage}`, `page=${nextPageNum}`]
  const queryString = queries.join('&')
  return await fetch(
    `https://api.github.com/repos/${repo}/issues?${queryString}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export async function getIssue(
  repo: string,
  accessToken: string,
  issueNumber: number
): Promise<Response> {
  return await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export async function addIssue(
  repo: string,
  accessToken: string,
  title: string,
  body: string,
  status: TaskStatus
): Promise<Response> {
  return await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: title,
      body: `${status}: ${body}`,
      state: 'open',
    }),
  })
}

export async function editIssue(
  repo: string,
  accessToken: string,
  issueNumber: number,
  title: string,
  body: string,
  status: TaskStatus
): Promise<Response> {
  return await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    {
      method: 'POST',
      headers: { Authorization: `token ${accessToken}` },
      body: JSON.stringify({ title: title, body: `${status}: ${body}` }),
    }
  )
}

export async function closeIssue(
  repo: string,
  accessToken: string,
  issueNumber: number
): Promise<Response> {
  return await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ state: 'closed' }),
    }
  )
}
