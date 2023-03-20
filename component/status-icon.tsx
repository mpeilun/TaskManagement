import { grey, red, green } from '@mui/material/colors'
import AdjustIcon from '@mui/icons-material/Adjust'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { TaskStatus } from '@/types/task-type'

export function getStatusColor(label: TaskStatus) {
  if (label === 'Open') {
    return grey[200]
  } else if (label === 'In Progress') {
    return red[200]
  } else if (label === 'Done') {
    return green[200]
  } else {
    return grey[200]
  }
}

function StatusIcon(props: { label: TaskStatus }) {
  const { label } = props
  if (label === 'Open') {
    return <AdjustIcon sx={{ color: getStatusColor('Open') }} />
  } else if (label === 'In Progress') {
    return <AccessTimeIcon sx={{ color: getStatusColor('In Progress') }} />
  } else if (label === 'Done') {
    return <CheckCircleOutlineIcon sx={{ color: getStatusColor('Done') }} />
  } else {
    return <></>
  }
}

export default StatusIcon
