import LabelSelector from '@/component/label-selector'
import TaskAdding from '@/component/task/task-adding'
import TaskCard from '@/component/task/task-card'
import { Task } from '@/types/task-type'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Switch,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Notification from '@/component/notification'
import { Severity } from '@/types/notification-type'

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
  const [labels, setLabels] = useState(['Open', 'In Progress', 'Done'])
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

  // Handel TaskTaskChange
  const handelAddTask = async (title: string, body: string) => {
    const pushTask = {
      title: title,
      body: body,
      state: 'open',
      labels: ['Open'],
    }
    const response = await fetch(
      'https://api.github.com/repos/mpeilun/IssueSearch/issues',
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(pushTask),
      }
    )

    if (response.status != 201) {
      return false
    } else {
      const result = (await response.json()) as Task
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
        if (task.number === issuesNum) {
          task.title = title
        }
        return task
      })
    )
  }

  const handelBodyChange = (issuesNum: number, body: string) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.number === issuesNum) {
          task.body = body
        }
        return task
      })
    )
  }

  // Data Fetching
  const fetchIssues = async (perPage: number) => {
    if (loading) return

    setLoading(true)

    const queries = [`order=desc`, `per_page=${perPage}`, `page=${nextPageNum}`]

    const queryString = queries.join('&')
    const response = await fetch(
      `https://api.github.com/repos/mpeilun/IssueSearch/issues?${queryString}`
    )

    if (!response.ok) {
      throw new Error('Failed to retrieve issues.')
    }

    const data: Task[] = await response.json()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // TaskCards
  const TaskList = taskList.map((task) => (
    <TaskCard
      key={task.number}
      task={task}
      deleteTask={handelDeleteTask}
      editTitle={handelTitleChange}
      editBody={handelBodyChange}
      labels={labels}
      sendNotification={sendNotification}
    />
  ))

  return (
    <Box
      width={'vh'}
      display="flex"
      flexDirection={'column'}
      justifyContent="center"
      padding={3}
    >
      {session ? (
        <Box
          display="flex"
          sx={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <Typography>Name: {session?.user?.name}</Typography>
          <Typography>AccessToken: {session?.accessToken}</Typography>
          <Button variant="outlined" sx={{ m: 2 }} onClick={() => signOut()}>
            登出
          </Button>
        </Box>
      ) : (
        <>
          <Button
            variant="outlined"
            sx={{ m: 2 }}
            onClick={() => {
              window.open('/signin', 'Sign In', 'width=600,height=600')
            }}
          >
            登入
          </Button>
        </>
      )}
      <Button
        onClick={() => {
          setIsAdding(true)
        }}
      >
        Add Task
      </Button>
      {isAdding && (
        <TaskAdding
          addTask={handelAddTask}
          setIsAdding={setIsAdding}
          sendNotification={sendNotification}
        />
      )}
      <LabelSelector labels={labels} setLabels={setLabels} />
      <Box display={'flex'} flexDirection={'row'}>
        <Typography>新-舊</Typography>
        <Switch
          value={sortReverse}
          onChange={(even) => setSortReverse(even.target.checked)}
        />
        <Typography>舊-新</Typography>
      </Box>
      {taskList && (
        <>
          <InfiniteScroll
            style={{ overflowY: 'hidden' }}
            dataLength={taskList.length} //This is important field to render the next data
            next={() => fetchIssues(10)}
            hasMore={hasMore}
            loader={<CircularProgress sx={{ margin: '0 auto 0 auto' }} />}
            endMessage={
              <Typography textAlign={'center'}>你已經滑到最底囉！</Typography>
            }
            // refreshFunction={() => fetchIssues(10)}
            // pullDownToRefresh={true}
            // pullDownToRefreshThreshold={50}
            // pullDownToRefreshContent={
            //   <h3 style={{ textAlign: 'center' }}>
            //     &#8595; Pull down to refresh
            //   </h3>
            // }
            // releaseToRefreshContent={
            //   <h3 style={{ textAlign: 'center' }}>
            //     &#8593; Release to refresh
            //   </h3>
            // }
          >
            {sortReverse ? TaskList.reverse() : TaskList}
          </InfiniteScroll>
        </>
      )}
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
