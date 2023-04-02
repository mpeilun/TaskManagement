import { forwardRef, Dispatch, SetStateAction } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { Severity } from '@/types/notification-type'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function Notification(props: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  severity: Severity
  message: string
  maintain?: boolean
}) {
  const { open, severity, message, setOpen, maintain } = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={maintain ? null : 2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
