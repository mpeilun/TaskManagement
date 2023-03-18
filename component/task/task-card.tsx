import { Task } from '@/types/task-type'
import { Card, Box, Typography, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { validateBody, validateTitle } from '@/util/validate'
import StatusIcon from '../status-icon'
import { Severity } from '@/types/notification-type'

const shouldDisplay = (labels: string[], taskStatus?: string[]) => {
  const taskStatusSet = new Set(taskStatus)
  for (const label of labels) {
    if (taskStatusSet.has(label)) {
      return true
    }
  }
}

function TaskCard(props: {
  task: Task
  deleteTask: (issuesNum: number) => void
  editTitle: (issuesNum: number, title: string) => void
  editBody: (issuesNum: number, body: string) => void
  labels: string[]
  sendNotification: (message: string, severity: Severity) => void
}) {
  const { task, deleteTask, editTitle, editBody, labels, sendNotification } =
    props
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [display, setDisplay] = useState<'none' | 'block'>('block')
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
  const [titleError, setTitleError] = useState(false)
  const [bodyError, setBodyError] = useState(false)
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)

  const taskStatus = task.labels?.at(0)?.name!

  useEffect(() => {
    if (!isEditing) {
      setTitle(task.title)
      setBody(task.body)
    }
  }, [task.title, task.body])

  useEffect(() => {
    if (
      shouldDisplay(
        labels,
        task.labels?.map((label) => label.name)
      )
    ) {
      setDisplay('block')
    } else {
      setDisplay('none')
    }
  }, [labels, task.labels])

  const handelTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setTitleError(validateTitle(event.target.value))
  }

  const handelBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value)
    setBodyError(validateBody(event.target.value))
  }

  if (!(task.state == 'open')) return <></>

  return (
    <Card sx={{ display: display, margin: 1, padding: 1, maxWidth: '440px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2">{taskStatus}</Typography>
      </Box>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <StatusIcon label={taskStatus} />
        {isEditing ? (
          <TextField
            error={titleError}
            helperText={titleError ? '標題不能為空' : null}
            value={title}
            onChange={handelTitleChange}
          ></TextField>
        ) : (
          <Typography variant="subtitle1" sx={{ marginLeft: '8px' }}>
            {task.title}
          </Typography>
        )}
      </Box>
      <Typography>
        創建時間 {task.created_at.toLocaleString('zh-TW')}
      </Typography>
      {isEditing ? (
        <TextField
          error={bodyError}
          helperText={bodyError ? '內容需 30 字以上' : null}
          value={body}
          onChange={handelBodyChange}
        ></TextField>
      ) : (
        <Typography variant="body2">{task.body}</Typography>
      )}
      {isEditing && (
        <Box display={'flex'} flexDirection={'row'}>
          <Button
            onClick={() => {
              setTitle(task.title)
              setBody(task.body)
              setIsEditing(false)
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={saveButtonLoading}
            onClick={async () => {
              if (validateTitle(title) || validateBody(body)) {
                setTitleError(validateTitle(title))
                setBodyError(validateBody(body))
                sendNotification('標題或內容格式錯誤', 'error')
              } else {
                setSaveButtonLoading(true)
                await fetch(
                  `https://api.github.com/repos/mpeilun/IssueSearch/issues/${task.number}`,
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/vnd.github+json',
                      Authorization: `Bearer ${session?.accessToken}`,
                    },
                    body: JSON.stringify({ title: title, body: body }),
                  }
                ).then((response) => {
                  if (response.status === 200) {
                    editTitle(task.number, title)
                    editBody(task.number, body)
                    setIsEditing(false)
                    sendNotification('編輯成功', 'success')
                  } else {
                    sendNotification('編輯失敗', 'error')
                  }
                  setSaveButtonLoading(false)
                })
              }
            }}
          >
            Save
          </LoadingButton>
        </Box>
      )}
      <LoadingButton
        loading={deleteButtonLoading}
        onClick={async () => {
          setDeleteButtonLoading(true)
          await fetch(
            `https://api.github.com/repos/mpeilun/IssueSearch/issues/${task.number}`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${session?.accessToken}`,
              },
              body: JSON.stringify({ state: 'closed' }),
            }
          ).then((response) => {
            if (response.status == 200) {
              deleteTask(task.number)
              sendNotification('刪除成功', 'success')
            } else {
              sendNotification('刪除失敗', 'error')
            }
            setDeleteButtonLoading(false)
          })
        }}
      >
        Delete
      </LoadingButton>
      <Button
        onClick={() => {
          setIsEditing(true)
        }}
      >
        Edit
      </Button>
    </Card>
  )
}

export default TaskCard
