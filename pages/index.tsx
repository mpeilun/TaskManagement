import StatusFilter from '@/component/status-filter'
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
  Card,
  Collapse,
  Divider,
  Tooltip,
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
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import { textAlign } from '@mui/system'

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
  const [notificationMaintain, setNotificationMaintain] = useState(false)

  const sendNotification = (
    message: string,
    severity: Severity,
    maintain?: boolean
  ) => {
    setNotificationOpen(true)
    setNotificationSeverity(severity)
    setNotificationMessage(message)
    setNotificationMaintain(maintain ?? false)
  }

  // Search State
  const [search, setSearch] = useState('')

  // Filter State
  const [filterExpanded, setFilterExpanded] = useState(false)

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

  const handleExpandClick = () => {
    setFilterExpanded(!filterExpanded)
  }

  // Data Fetching
  const fetchIssues = async (perPage: number) => {
    if (loading) return
    setLoading(true)
    const response = await searchIssue(
      REPO!,
      session?.accessToken!,
      perPage,
      nextPageNum
    )

    if (!response.ok) {
      setLoading(false)
      sendNotification(
        `The ${REPO} repo is private. Add account to collaborator or make project public`,
        'error',
        true
      )
      return
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
          <Box
            display={'flex'}
            flexDirection={'row'}
            sx={{ minWidth: { md: '600px', sm: '400px', xs: '400px' } }}
          >
            <Card
              sx={{
                padding: 3,
                width: { md: '600px', sm: '400px', xs: '400px' },
              }}
            >
              {/* Search bar */}
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={'Filter'}>
                        <IconButton
                          sx={{
                            transform: !filterExpanded
                              ? 'rotate(0deg)'
                              : 'rotate(180deg)',
                            transition: (theme) =>
                              theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                              }),
                          }}
                          onClick={() => {
                            handleExpandClick()
                          }}
                        >
                          <FilterListIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                label="Search"
                value={search}
                helperText="Search by title, content, owner"
                onChange={handelSearchChange}
              ></TextField>
              <Divider sx={{ margin: '8px 0' }} />
              <Collapse in={filterExpanded} timeout="auto" unmountOnExit>
                {/* Filter by status */}
                <StatusFilter
                  statusTags={statusTags}
                  setStatusTags={setStatusTags}
                />
                {/* Sort by time */}
                <Box
                  sx={{ padding: 1 }}
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                >
                  <Typography color={!sortReverse ? 'primary.main' : 'inherit'}>
                    Newest to Oldest
                  </Typography>
                  <Switch
                    value={sortReverse}
                    onChange={(even) => setSortReverse(even.target.checked)}
                  />
                  <Typography color={sortReverse ? 'primary.main' : 'inherit'}>
                    Oldest to Newest
                  </Typography>
                </Box>
              </Collapse>
            </Card>
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
        maintain={notificationMaintain}
      />
    </Box>
  )
}

export default HomePage
