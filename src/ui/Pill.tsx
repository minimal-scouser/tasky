import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode | ReactNode[]
}

function Pill(props: Props) {
  return (
    <Box
      sx={{
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
        border: '1px dashed blue',
        height: 'fit-content',
        px: 1,
        width: 'fit-content'
      }}
    >
      {props.children}
    </Box>
  )
}

export default Pill
