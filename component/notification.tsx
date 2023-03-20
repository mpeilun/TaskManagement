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
}) {
  const { open, severity, message, setOpen } = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
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
