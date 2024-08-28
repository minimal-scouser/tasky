import { Stack, Typography } from '@mui/material'

function TasksPlaceholder() {
  return (
    <Stack
      sx={{
        backgroundColor: '#f5f5f5',
        border: '1px dashed #b0b0b0',
        flexGrow: 1,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="body1">Add some tasks</Typography>
    </Stack>
  )
}

export default TasksPlaceholder
