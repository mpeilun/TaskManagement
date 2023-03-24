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
import { useCallback, useEffect, useMemo, useState } from 'react'
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

const DEBUG = false
const REPO = process.env.GITHUB_REPO

function HomePage() {
  const { data: session } = useSession()

  // Data State
  const [taskData, setTaskData] = useState<Task[]>([])

  // Loading State
  const [nextPageNum, setNextPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // TaskCard State
  const [taskCardList, setTaskCardList] = useState<JSX.Element[]>([])
  const [tasksLength, setTasksLength] = useState(0)
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
  const handelAddTask = useCallback(
    async (title: string, body: string, status: TaskStatus) => {
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
        console.log('add', result)
        setTaskData((prev) => [result, ...prev])
        setTasksLength((prev) => prev + 1)
        return true
      }
    },
    [session, setTaskData]
  )

  const handelDeleteTask = useCallback(
    (issuesNum: number) => {
      setTaskData((prev) => prev.filter((task) => task.number !== issuesNum))
      setTasksLength((prev) => prev - 1)
    },
    [setTaskData, setTasksLength]
  )

  const handelTitleChange = useCallback(
    (issuesNum: number, title: string) => {
      setTaskData((prev) =>
        prev.map((task) => {
          if (task.number == issuesNum) {
            task.title = title
          }
          return task
        })
      )
    },
    [setTaskData]
  )

  const handelBodyChange = useCallback(
    (issuesNum: number, body: string) => {
      setTaskData((prev) =>
        prev.map((task) => {
          if (task.number == issuesNum) {
            task.body = body
          }
          return task
        })
      )
    },
    [setTaskData]
  )

  const handelStatusChange = useCallback(
    (issuesNum: number, status: TaskStatus) => {
      setTaskData((prev) =>
        prev.map((task) => {
          if (task.number == issuesNum) {
            task.status = status
          }
          return task
        })
      )
    },
    [setTaskData]
  )

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
      setTaskData((prev) => [...prev, ...data])
      setNextPageNum((prev) => {
        return prev + 1
      })
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (session && taskData.length === 0) {
      fetchIssues(10)
    }
  }, [session])

  // Generate fake data for Testing
  async function execute() {
    for (let i = 0; i < 10; i++) {
      await wait(1000)
      handelAddTask(
        `Fake Data ${i}`,
        'Task For Testing. Automate API requests to load 10 more items when the list is scrolled to the end until there are no more tasks left.',
        'Done'
      )
    }
  }
  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // TaskCards
  const generateTaskCards = useCallback(
    (tasks: Task[]) => {
      console.log('generateTaskCards', tasks)
      return tasks.map((task, index) => (
        <TaskCard
          key={task.number}
          index={index}
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
    },
    [
      search,
      statusTags,
      handelDeleteTask,
      handelTitleChange,
      handelBodyChange,
      handelStatusChange,
    ]
  )

  //TODO 了解 useCallback 與 useMemo

  useEffect(() => {
    if (!loading) {
      const newTasks = taskData.slice(tasksLength)

      if (newTasks.length > 0) {
        const newTaskCards = generateTaskCards(newTasks)
        setTaskCardList((prev) => [...prev, ...newTaskCards])
        setTasksLength(taskData.length)
      }
    }
  }, [taskData, generateTaskCards, loading, tasksLength])

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
            {/* DEBUG MODE */}
            {DEBUG && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    execute()
                  }}
                >
                  Generate Fake Data
                </Button>
              </>
            )}
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
          {taskData && (
            <>
              <InfiniteScroll
                style={{ overflow: 'hidden' }}
                dataLength={taskData.length}
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
                  {sortReverse ? taskCardList.reverse() : taskCardList}
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
