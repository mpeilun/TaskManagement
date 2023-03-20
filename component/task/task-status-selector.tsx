import { useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { TaskStatus } from '@/types/task-type'

const tags: TaskStatus[] = ['Open', 'In Progress', 'Done']

function TaskStatusSelector(props: {
  value: TaskStatus
  onValueChange: (status: TaskStatus) => void
}) {
  const { value, onValueChange } = props
  return (
    <FormControl>
      <RadioGroup
        row
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value as TaskStatus)
        }}
      >
        {tags.map((tag, index) => {
          return (
            <FormControlLabel
              key={`status-${index}`}
              value={tag}
              control={<Radio />}
              label={tag}
            />
          )
        })}
      </RadioGroup>
    </FormControl>
  )
}

export default TaskStatusSelector
