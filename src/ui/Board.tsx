import {
  Box,
  Stack,
  Typography,
  OutlinedInput,
  Button,
  IconButton,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Menu,
  Divider,
} from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ClearIcon from '@mui/icons-material/Clear'
import SortIcon from '@mui/icons-material/Sort'
import SearchIcon from '@mui/icons-material/Search'
import { Actions, Board as TBoard } from '../types'
import TasksPlaceholder from './TasksPlaceholder'
import { useNavigate } from 'react-router-dom'
import Items from './Items'

interface Props {
  board: TBoard
  dispatch: React.Dispatch<Actions>
}

function Board(props: Props) {
  const { board, dispatch } = props

  const isBoardEmpty = board.items.length === 0

  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const navigate = useNavigate()

  function toggleEditingBoardTitle() {
    setIsEditingBoardTitle(!isEditingBoardTitle)
  }

  function handleBoardTitleEdit(e: any) {
    dispatch({
      type: 'edit-board',
      payload: {
        field: 'name',
        value: e.target.value,
        id: board.id,
      },
    })
  }

  function handleEnterKeyInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter' || e.code === 'Escape') {
      toggleEditingBoardTitle()
    }
  }

  function showBoardOptions(e: React.MouseEvent<HTMLElement>) {
    setAnchor(e.currentTarget)
  }

  function hideBoardOptions(option: string) {
    setAnchor(null)

    if (option === 'delete') {
      dispatch({
        type: 'delete-board',
        payload: {
          id: board.id,
        },
      })
    }
  }

  function handleAddItem(boardId: number) {
    navigate(`/new-task?boardId=${boardId}`)
  }

  return (
    <Stack
      data-testid="board"
      sx={{
        minHeight: 600,
        minWidth: 300,
        backgroundColor: '#FAFAFA',
        borderRadius: 2,
        overflowX: 'scroll',
      }}
    >
      <Stack
        sx={{
          padding: 2,
          flexGrow: 1,
        }}
        data-testid="drop-container"
        gap={2}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
        }}
        onDrop={(e) => {
          e.preventDefault()

          const data = e.dataTransfer.getData('text/plain')
          const formattedData = JSON.parse(data)

          const targetBoardId = board.id
          const parentBoardId = formattedData.boardId

          dispatch({
            type: 'delete-item',
            payload: { boardId: parentBoardId, itemId: formattedData.id },
          })
          dispatch({
            type: 'upsert-item',
            payload: {
              item: {
                ...formattedData,
                boardId: targetBoardId,
              },
            },
          })
        }}
      >
        <Stack
          sx={{
            height: 28,
          }}
          direction="row"
          alignItems="center"
        >
          {isEditingBoardTitle ? (
            <OutlinedInput
              size="small"
              defaultValue={board.name}
              onChange={handleBoardTitleEdit}
              sx={{
                width: '100%',
                height: 28,
              }}
              autoFocus
              onBlur={toggleEditingBoardTitle}
              onKeyDown={handleEnterKeyInput}
              inputProps={{
                'data-testid': 'board-name-input',
              }}
            />
          ) : (
            <Box
              data-testid="board-name"
              onDoubleClick={toggleEditingBoardTitle}
              sx={{ width: '100%' }}
            >
              <Typography variant="body1">{board.name}</Typography>
            </Box>
          )}
          {!isEditingBoardTitle && (
            <>
              <IconButton aria-label="board-options" onClick={showBoardOptions}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="board-menu"
                anchorEl={anchor}
                open={anchor != null}
                onClose={hideBoardOptions}
                slotProps={{
                  paper: {
                    sx: {
                      width: 150,
                    },
                  },
                }}
              >
                <MenuItem onClick={() => hideBoardOptions('sort')}>
                  <ListItemIcon>
                    <SortIcon />
                  </ListItemIcon>
                  <ListItemText>Sort</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => hideBoardOptions('find')}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText>Search</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => hideBoardOptions('delete')}>
                  <ListItemIcon>
                    <ClearIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography color="error">Delete</Typography>}
                  />
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
        <Stack flexGrow={1}>
          {isBoardEmpty ? (
            <TasksPlaceholder />
          ) : (
            <Items items={board.items} dispatch={dispatch} />
          )}
        </Stack>
      </Stack>

      <Button
        variant="text"
        startIcon={<AddIcon color="action" />}
        onClick={() => handleAddItem(board.id)}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          // mt: 'auto',
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Add item
        </Typography>
      </Button>
    </Stack>
  )
}

export default Board
