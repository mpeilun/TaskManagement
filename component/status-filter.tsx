import React, { Dispatch, SetStateAction } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { TaskStatus } from '@/types/task-type'

const labels = ['Open', 'In Progress', 'Done']

function StatusFilter(props: {
  statusTags: TaskStatus[]
  setStatusTags: Dispatch<SetStateAction<TaskStatus[]>>
}) {
  const { statusTags, setStatusTags } = props

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    setStatusTags(value as TaskStatus[])
  }

  return (
    <div>
      <FormControl sx={{ width: '100%', marginTop: '8px' }}>
        <InputLabel>Status</InputLabel>
        <Select
          multiple
          value={statusTags as string[]}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {labels.map((label) => (
            <MenuItem key={label} value={label}>
              <Checkbox checked={statusTags.includes(label as TaskStatus)} />
              <ListItemText primary={label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default StatusFilter
