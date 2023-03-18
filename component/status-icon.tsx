import { grey, red, green } from '@mui/material/colors'
import AdjustIcon from '@mui/icons-material/Adjust'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

function StatusIcon(props: { label: string }) {
  const { label } = props
  if (label === 'Open') {
    return <AdjustIcon sx={{ color: grey[500] }} />
  } else if (label === 'In Progress') {
    return <AccessTimeIcon sx={{ color: red[500] }} />
  } else if (label === 'Done') {
    return <CheckCircleOutlineIcon sx={{ color: green[500] }} />
  } else {
    return <></>
  }
}

export default StatusIcon
