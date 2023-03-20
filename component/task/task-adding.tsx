import { Severity } from '@/types/notification-type'
import { validateBody, validateTitle } from '@/util/validate'
import { Box, Button, Card, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import TaskStatusSelector from './task-status-selector'
import { TaskStatus } from '@/types/task-type'

function TaskAdding(props: {
  statusTags: TaskStatus[]
  addTask: (title: string, body: string, status: TaskStatus) => Promise<boolean>
  setIsAdding: Dispatch<SetStateAction<boolean>>
  sendNotification: (message: string, severity: Severity) => void
}) {
  const { statusTags, addTask, setIsAdding, sendNotification } = props
  const [status, setStatus] = useState<TaskStatus>('Open')
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
        padding: 3,
        width: { md: '600px', sm: '400px', xs: '400px' },
      }}
    >
      <TextField
        fullWidth
        error={titleError}
        helperText={titleError ? 'Title cannot be empty.' : null}
        sx={{ margin: '8px 0' }}
        label="Title"
        value={title}
        onChange={handelTitleChange}
      />
      <TextField
        fullWidth
        multiline
        error={bodyError}
        helperText={
          bodyError
            ? 'The content needs to be more than 30 characters long.'
            : null
        }
        sx={{ margin: '8px 0' }}
        label="Content"
        value={body}
        onChange={handelBodyChange}
      />
      <TaskStatusSelector
        value={status}
        onValueChange={(value) => setStatus(value)}
      />
      <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
        <Button
          sx={{ marginRight: '8px' }}
          variant="outlined"
          onClick={() => {
            setIsAdding(false)
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="outlined"
          loading={saveButtonLoading}
          onClick={async () => {
            if (validateTitle(title) || validateBody(body)) {
              setTitleError(validateTitle(title))
              setBodyError(validateBody(body))
              sendNotification('Invalid title or content format.', 'error')
            } else {
              setSaveButtonLoading(true)
              if (await addTask(title, body, status)) {
                setIsAdding(false)
                sendNotification('Add Successful', 'success')
              } else {
                sendNotification('Add Failed', 'error')
              }
              setSaveButtonLoading(false)
            }
          }}
        >
          Add
        </LoadingButton>
      </Box>
    </Card>
  )
}

export default TaskAdding
