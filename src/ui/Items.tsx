import {
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import { Actions, Item as TItem } from '../types'
import { useNavigate } from 'react-router-dom'
import React, { DragEventHandler } from 'react'

interface Props {
  items: TItem[]
  dispatch: React.Dispatch<Actions>
}

function Items(props: Props) {
  const { items, dispatch } = props

  return (
    <List
    >
      {items.map((item) => {
        return <Item key={item.id} item={item} dispatch={dispatch} />
      })}
    </List>
  )
}

interface ItemProps {
  item: TItem
  dispatch: React.Dispatch<Actions>
}

function Item(props: ItemProps) {
  const { item, dispatch } = props
  const navigate = useNavigate()

  function handleItemClick() {
    navigate(`/task?boardId=${item.boardId}&itemId=${item.id}`)
  }

  return (
    <ListItem
      data-testid="item"
      sx={{
        bgcolor: 'background.paper',
        p: 0,
        boxShadow: 2,
        my: 1,
      }}
    >
      <ListItemButton
        disableRipple
        onClick={handleItemClick}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify(item))
          e.dataTransfer.effectAllowed = "move";

        }}
      >
        <Stack spacing={2}>
          <Typography>{item.title}</Typography>
          {/* <Typography noWrap>{item.description}</Typography> */}

          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={handleItemClick}>
              {item.favorite === 'on' ? <Favorite color="error" /> : null}
            </IconButton>
          </Box> */}
        </Stack>
      </ListItemButton>
    </ListItem>
  )
}

export default Items
