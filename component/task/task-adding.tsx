import { Severity } from '@/types/notification-type'
import { validateBody, validateTitle } from '@/util/validate'
import { Box, Button, Card, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

function TaskAdding(props: {
  addTask: (title: string, body: string) => Promise<boolean>
  setIsAdding: Dispatch<SetStateAction<boolean>>
  sendNotification: (message: string, severity: Severity) => void
}) {
  const { addTask, setIsAdding, sendNotification } = props
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [bodyError, setBodyError] = useState(false)
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)

  const handelTitleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(event.target.value)
    setTitleError(validateTitle(event.target.value))
  }
  const handelBodyChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBody(event.target.value)
    setBodyError(validateBody(event.target.value))
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: 1,
        padding: 1,
        maxWidth: '440px',
      }}
    >
      <TextField
        error={titleError}
        helperText={titleError ? '標題不能為空' : null}
        sx={{ margin: 1 }}
        label="標題"
        value={title}
        onChange={handelTitleChange}
      />
      <TextField
        error={bodyError}
        helperText={bodyError ? '內容需 30 字以上' : null}
        sx={{ margin: 1 }}
        label="內容"
        value={body}
        onChange={handelBodyChange}
      />
      <Box display={'flex'} flexDirection={'row'}>
        <Button
          onClick={() => {
            setIsAdding(false)
          }}
        >
          取消
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
              if (await addTask(title, body)) {
                setIsAdding(false)
                sendNotification('新增成功', 'success')
              } else {
                sendNotification('新增失敗', 'error')
              }
              setSaveButtonLoading(false)
            }
          }}
        >
          新增
        </LoadingButton>
      </Box>
    </Card>
  )
}

export default TaskAdding
