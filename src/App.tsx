import useBoards from './usecases/useBoards'
import { Box, Button, Stack, Typography } from '@mui/material'
import './App.css'
import { Board } from './ui'
import { Outlet } from 'react-router-dom'

function App() {
  const [boards, dispatch] = useBoards()

  return (
    <>
      <Box>
        <Stack
          direction="row"
          sx={{
            paddingBlock: 2,
          }}
        >
          <Typography
            variant="h5"
            color="textPrimary"
            fontWeight={500}
            gutterBottom
          >
            Boards
          </Typography>

          <Button
            variant="contained"
            sx={{
              marginLeft: 'auto',
            }}
            disableElevation
            disableRipple
            onClick={() => {
              dispatch({ type: 'add-board' })
            }}
          >
            Add Board
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            padding: 2,
            borderRadius: 2,
            backgroundColor: '#d0d0d0',
            overflowX: 'scroll',
          }}
        >
          {boards.map((board, idx) => {
            return <Board key={idx} board={board} dispatch={dispatch} />
          })}
        </Stack>
      </Box>
      <Outlet context={{ dispatch, boards }} />
    </>
  )
}

export default App
