import { Task, TaskStatus } from '@/types/task-type'
import {
  Card,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Avatar,
  Tooltip,
  InputAdornment,
  ButtonGroup,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { validateBody, validateTitle } from '@/util/validate'
import StatusIcon, { getStatusColor } from '../status-icon'
import { Severity } from '@/types/notification-type'
import { closeIssue, editIssue } from '@/util/github-api'
import TaskStatusSelector from './task-status-selector'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { red, grey, blue } from '@mui/material/colors'
import Link from 'next/link'
import moment from 'moment'
import Divider from '@mui/material/Divider'

function TaskCard(props: {
  index: number
  repo: string
  task: Task
  search: string
  statusTags: TaskStatus[]
  deleteTask: (issuesNum: number) => void
  editTitle: (issuesNum: number, title: string) => void
  editBody: (issuesNum: number, body: string) => void
  editStatus: (issuesNum: number, status: TaskStatus) => void
  sendNotification: (message: string, severity: Severity) => void
}) {
  const {
    index,
    repo,
    task,
    search,
    statusTags,
    deleteTask,
    editTitle,
    editBody,
    editStatus,
    sendNotification,
  } = props
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [display, setDisplay] = useState<'none' | 'block'>('block')
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
  const [status, setStatus] = useState(task.status)
  const [titleError, setTitleError] = useState(false)
  const [bodyError, setBodyError] = useState(false)
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setTitle(task.title)
      setBody(task.body)
      setStatus(task.status)
    }
  }, [task.title, task.body, task.status])

  const handelTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setTitleError(validateTitle(event.target.value))
  }

  const handelBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value)
    setBodyError(validateBody(event.target.value))
  }

  const [anchorElEdit, setAnchorElEdit] = useState<null | HTMLElement>(null)
  const handleOpenEditMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElEdit(event.currentTarget)
  }
  const handleCloseEditMenu = () => {
    setAnchorElEdit(null)
  }

  if (
    !(
      title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      body.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      task.user.login.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  )
    return <></>
  if (!(task.state == 'open')) return <></>
  if (!statusTags.includes(status)) return <></>

  return (
    <Card
      sx={{
        display: display,
        margin: 1,
        padding: 3,
        width: { md: '600px', sm: '400px', xs: '400px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            padding: '8px 16px',
            boxShadow: 'none',
            backgroundColor: getStatusColor(isEditing ? status : task.status),
          }}
        >
          <Typography variant="body2">{status}</Typography>
        </Card>

        <IconButton onClick={handleOpenEditMenu} sx={{ p: 0 }}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          sx={{ mt: '32px', '& .MuiList-padding': { p: '0px' } }}
          anchorEl={anchorElEdit}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElEdit)}
          onClose={handleCloseEditMenu}
        >
          {/* Edit Button */}
          <MenuItem
            onClick={() => {
              handleCloseEditMenu()
              setIsEditing(true)
            }}
          >
            <EditIcon sx={{ marginRight: '5px' }} />
            <Typography>Edit</Typography>
          </MenuItem>
          {/* Delete Button */}
          <MenuItem
            onClick={async () => {
              setDeleteButtonLoading(true)
              await closeIssue(repo, session?.accessToken!, task.number).then(
                (response) => {
                  if (response.status == 200) {
                    deleteTask(task.number)
                    sendNotification('Delete Successful', 'success')
                  } else if (response.status == 403) {
                    sendNotification(
                      'To modify this task, you must be the poster or a collaborator of the repo.',
                      'warning'
                    )
                  } else {
                    sendNotification(
                      `Delete Failed, status:${response.status}`,
                      'error'
                    )
                  }
                  setDeleteButtonLoading(false)
                }
              )
            }}
          >
            {deleteButtonLoading ? (
              <CircularProgress
                size="1rem"
                sx={{
                  color: red[300],
                  margin: 'auto',
                }}
              />
            ) : (
              <>
                <DeleteIcon sx={{ marginRight: '5px', color: red[300] }} />
                <Typography color={red[300]}>Delete</Typography>
              </>
            )}
          </MenuItem>
        </Menu>
      </Box>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        {isEditing ? (
          <TextField
            sx={{ marginTop: '8px' }}
            fullWidth
            error={titleError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StatusIcon label={status} />
                </InputAdornment>
              ),
            }}
            helperText={titleError ? 'Title cannot be empty.' : null}
            value={title}
            onChange={handelTitleChange}
          ></TextField>
        ) : (
          <Box
            display={'flex'}
            flexDirection={'row'}
            mt={1}
            alignItems={'center'}
          >
            <StatusIcon label={status} />
            <Typography variant="subtitle1" sx={{ marginLeft: '8px' }}>
              {task.title}
            </Typography>
          </Box>
        )}
      </Box>
      {isEditing ? (
        <TextField
          sx={{ margin: '8px 0px' }}
          fullWidth
          multiline
          error={bodyError}
          helperText={
            bodyError
              ? 'The content needs to be more than 30 characters long.'
              : null
          }
          value={body}
          onChange={handelBodyChange}
        ></TextField>
      ) : (
        <Box sx={{ margin: '8px 0px', padding: '0px 8px' }}>
          <Typography variant={'body2'}>{task.body}</Typography>
          <Divider sx={{ margin: '16px 0px 16px 0px' }} />
        </Box>
        // <TextField
        //   variant="standard"
        //   disabled
        //   fullWidth
        //   multiline
        //   rows={4}
        //   sx={{
        //     margin: '8px 0px',
        //     padding: '0px 8px',
        //     '& .MuiInputBase-input.MuiInput-input.Mui-disabled': {
        //       WebkitTextFillColor: 'black',
        //     },
        //   }}
        //   value={task.body}
        // ></TextField>
      )}
      {isEditing && (
        <TaskStatusSelector
          value={status}
          onValueChange={(value) => {
            setStatus(value)
          }}
        />
      )}
      {isEditing && (
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
          <Button
            sx={{ marginRight: '8px' }}
            variant="outlined"
            onClick={() => {
              setTitle(task.title)
              setBody(task.body)
              setStatus(task.status)
              setIsEditing(false)
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
                await editIssue(
                  repo,
                  session?.accessToken!,
                  task.number,
                  title,
                  body,
                  status
                ).then((response) => {
                  if (response.status === 200) {
                    //edit
                    editTitle(task.number, title)
                    editBody(task.number, body)
                    editStatus(task.number, status)
                    setIsEditing(false)
                    sendNotification('Edit Successful.', 'success')
                  } else if (response.status == 403) {
                    sendNotification(
                      'To modify this task, you must be the poster or a collaborator of the repo.',
                      'warning'
                    )
                  } else {
                    sendNotification('Edit Failed.', 'error')
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
      <Box
        margin={'8px 0px 0px 0px'}
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
      >
        {/* Create by and time */}
        <Tooltip title={task.user.login}>
          <IconButton
            sx={{ marginRight: '8px', width: '20px', height: '20px' }}
            onClick={() => {
              window.open(task.user.html_url)
            }}
          >
            <Avatar
              sx={{ width: '20px', height: '20px' }}
              alt={'PosterPhoto'}
              src={task.user.avatar_url}
            />
          </IconButton>
        </Tooltip>
        <Typography color={grey[500]} sx={{ mr: '4px' }}>
          <Link
            href={task.user.html_url}
            style={{ color: grey[700], textDecoration: 'none' }}
          >
            {task.user.login}
          </Link>
        </Typography>
        <Tooltip title={moment(task.created_at).format('lll')}>
          <Typography color={grey[500]}>
            {'posted ' + moment(task.created_at).startOf('minute').fromNow()}
          </Typography>
        </Tooltip>
      </Box>
      {/* Card Index */}
      <Box display={'flex'} justifyContent={'end'}>
        <Typography
          color={grey[500]}
          sx={{ margin: '0' }}
        >{`#${index}`}</Typography>
      </Box>
    </Card>
  )
}

export default TaskCard
