import StatusSelector from '@/component/status-filter'
import TaskAdding from '@/component/task/task-adding'
import TaskCard from '@/component/task/task-card'
import { Task, TaskStatus } from '@/types/task-type'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Switch,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Notification from '@/component/notification'
import { Severity } from '@/types/notification-type'
import { addIssue, searchIssue } from '@/util/github-api'
import {
  handelAllTaskFetchResponse,
  handelTaskFetchResponse,
} from '@/util/validate'
import { grey } from '@mui/material/colors'
import GitHubIcon from '@mui/icons-material/GitHub'
import SortIcon from '@mui/icons-material/Sort'
import SearchIcon from '@mui/icons-material/Search'

const REPO = process.env.GITHUB_REPO

function HomePage() {
  const { data: session } = useSession()

  // Data State
  const [taskList, setTaskList] = useState<Task[]>([])

  // Loading State
  const [nextPageNum, setNextPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // TaskCard State
  const [isAdding, setIsAdding] = useState(false)
  const [statusTags, setStatusTags] = useState<TaskStatus[]>([
    'Open',
    'In Progress',
    'Done',
  ])
  const [sortReverse, setSortReverse] = useState(false)

  // Notification State
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationSeverity, setNotificationSeverity] =
    useState<Severity>('info')
  const [notificationMessage, setNotificationMessage] = useState('')

  const sendNotification = (message: string, severity: Severity) => {
    setNotificationOpen(true)
    setNotificationSeverity(severity)
    setNotificationMessage(message)
  }

  //Search State
  const [search, setSearch] = useState('')

  // Handel TaskTaskChange
  const handelAddTask = async (
    title: string,
    body: string,
    status: TaskStatus
  ) => {
    const response = await addIssue(
      REPO!,
      session?.accessToken!,
      title,
      body,
      status
    )

    if (response.status != 201) {
      return false
    } else {
      const result = await handelTaskFetchResponse(response)
      setTaskList((prev) => [result, ...prev])
      return true
    }
  }

  const handelDeleteTask = (issuesNum: number) => {
    setTaskList((prev) => prev.filter((task) => task.number !== issuesNum))
  }

  const handelTitleChange = (issuesNum: number, title: string) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.number == issuesNum) {
          task.title = title
        }
        return task
      })
    )
  }

  const handelBodyChange = (issuesNum: number, body: string) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.number == issuesNum) {
          task.body = body
        }
        return task
      })
    )
  }

  const handelStatusChange = (issuesNum: number, status: TaskStatus) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.number == issuesNum) {
          task.status = status
        }
        return task
      })
    )
  }

  const handelSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // Data Fetching
  const fetchIssues = async (perPage: number) => {
    if (loading) return
    setLoading(true)
    const response = await searchIssue(REPO!, perPage, nextPageNum)

    if (!response.ok) {
      throw new Error('Failed to retrieve issues.')
    }

    const data: Task[] = await handelAllTaskFetchResponse(response)

    if (data && data.length > 0) {
      setTaskList((prev) => [...prev, ...data])
      setNextPageNum((prev) => {
        return prev + 1
      })
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (session && taskList.length === 0) {
      fetchIssues(10)
    }
  }, [session])

  // TaskCards
  const TaskList = taskList.map((task) => (
    <TaskCard
      key={task.number}
      repo={REPO!}
      search={search}
      task={task}
      statusTags={statusTags}
      deleteTask={handelDeleteTask}
      editTitle={handelTitleChange}
      editBody={handelBodyChange}
      editStatus={handelStatusChange}
      sendNotification={sendNotification}
    />
  ))

  if (REPO == undefined) {
    return (
      <Box>
        <Typography variant="h5" textAlign={'center'} color={'error'}>
          Please setting GITHUB_REPO in env!
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{ width: { md: '600px', sm: '400px', xs: '400px' } }}
      display="flex"
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      padding={3}
      margin={'auto'}
    >
      {session ? (
        <>
          <StatusSelector
            statusTags={statusTags}
            setStatusTags={setStatusTags}
          />
          <TextField
            sx={{
              marginTop: '8px',
              minWidth: { md: '600px', sm: '400px', xs: '400px' },
              '& .MuiFormHelperText-root': {
                textAlign: 'end !important',
              },
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            label="Search"
            value={search}
            helperText="Search by title, content, owner"
            onChange={handelSearchChange}
          ></TextField>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Typography>new to old</Typography>
            <Switch
              value={sortReverse}
              onChange={(even) => setSortReverse(even.target.checked)}
            />
            <Typography>old to new</Typography>
          </Box>
          {!isAdding && (
            <Button
              sx={{
                minWidth: { md: '600px', sm: '400px', xs: '400px' },
                margin: '8px 0px',
              }}
              fullWidth
              variant="contained"
              onClick={() => {
                setIsAdding(true)
              }}
            >
              Add Task
            </Button>
          )}
          {isAdding && (
            <TaskAdding
              statusTags={statusTags}
              addTask={handelAddTask}
              setIsAdding={setIsAdding}
              sendNotification={sendNotification}
            />
          )}
          {taskList && (
            <>
              <InfiniteScroll
                style={{ overflow: 'hidden' }}
                dataLength={taskList.length}
                next={() => fetchIssues(10)}
                hasMore={hasMore}
                loader={
                  loading && (
                    <CircularProgress
                      sx={{ display: 'flex', margin: '16px auto' }}
                    />
                  )
                }
                endMessage={
                  <Typography
                    textAlign={'center'}
                    margin={'8px auto 4px auto'}
                    color={grey}
                  >
                    You have reached the bottom!
                  </Typography>
                }
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  {sortReverse ? TaskList.reverse() : TaskList}
                </Box>
              </InfiniteScroll>
            </>
          )}
        </>
      ) : (
        <>
          {/* SignIn */}
          <Button
            variant="outlined"
            color="github"
            sx={{ m: 2, color: 'black', borderColor: 'black' }}
            onClick={() => {
              window.open('/signin', 'Sign In', 'width=600,height=600')
            }}
          >
            {<GitHubIcon sx={{ mr: '8px' }} />}
            Sign in with Github
          </Button>
        </>
      )}

      {/* Notification */}
      <Notification
        open={notificationOpen}
        severity={notificationSeverity}
        message={notificationMessage}
        setOpen={setNotificationOpen}
      />
    </Box>
  )
}

export default HomePage
