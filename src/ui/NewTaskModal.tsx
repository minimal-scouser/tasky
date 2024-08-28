import { Favorite, FavoriteBorder } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router-dom'
import { selectTaskFromBoards } from '../helper'
import { Actions, Board, Item } from '../types'
import { useEffect, useState } from 'react'
import Pill from './Pill'

interface OutletContext {
  dispatch: React.Dispatch<Actions>
  boards: Board[]
}

const DEFAULT_TASK: Item = {
  boardId: 0,
  deadline: '',
  id: 0,
  status: '',
  title: '',
  description: '',
  favorite: false,
  images: [],
}

function getDefaultTask(boardId: number) {
  const task = { ...DEFAULT_TASK }
  task.boardId = boardId

  return task
}

function NewTaskModal() {
  const [formData, setFormData] = useState<Item>(DEFAULT_TASK)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isNewForm, setIsNewForm] = useState(true)

  const { dispatch, boards } = useOutletContext<OutletContext>()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const boardId = Number(params.get('boardId') ?? Number.NaN)
  const taskId = Number(params.get('itemId') ?? Number.NaN)

  const hasBoth = !Number.isNaN(boardId) && !Number.isNaN(taskId)

  let task = hasBoth ? selectTaskFromBoards(boardId, taskId, boards) : null
  if (task == null) {
    task = getDefaultTask(boardId)
  }

  useEffect(() => {
    if (!task) {
      // invalid task
      goBack()
      return
    }

    setFormData(task)

    const newTask = task.id === 0
    setIsNewForm(newTask)
    setIsEditMode(newTask)
  }, [task.id])

  function goBack() {
    navigate(-1)
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // const formData = new FormData(e.currentTarget)
    // const item = Object.fromEntries(formData.entries())
    const item = { ...formData }
    if (item.id === 0) {
      item.id = Date.now()
    }

    dispatch({
      type: 'upsert-item',
      payload: {
        item,
      },
    })

    goBack()
  }

  function validateInputs() {
    return true
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value: _value } = e.target
    let value: any = _value

    if (name === 'favorite') {
      value = e.target.checked
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function deleteItem() {
    dispatch({
      type: 'delete-item',
      payload: {
        itemId: formData.id,
        boardId: formData.boardId,
      },
    })

    navigate('/')
  }

  function ActionButtons() {
    if (isNewForm) {
      return (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={validateInputs}
        >
          Add
        </Button>
      )
    }
  
    if (isEditMode) {
      return (
        <>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={validateInputs}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setIsEditMode(false)
            }}
          >
            Cancel
          </Button>
        </>
      )
    }
  }

  function onEdit() {
    setIsEditMode(true)
  }

  return (
    <Modal
      open
      onClose={goBack}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {!boardId ? (
        <Typography>Whoops</Typography>
      ) : (
        <Box sx={style}>
          <Stack direction="row" alignItems="center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {task !== null ? task.title : 'New Task'}
            </Typography>
            {!isEditMode && (
              <Checkbox
                icon={<FavoriteBorder />}
                checked={formData.favorite}
                disabled
                checkedIcon={<Favorite color="error" />}
                sx={{ ml: 'auto' }}
              />
            )}
          </Stack>
          <Box sx={{ flexGrow: 1 }}>
            {!isEditMode && task ? (
              <ReadOnlyMode
                formData={formData}
                onEdit={onEdit}
                onDelete={deleteItem}
              />
            ) : (
              <Grid2 container spacing={4}>
                <Grid2
                  container
                  component="form"
                  sx={{
                    paddingBlock: 2,
                    display: 'flex',
                    flexFlow: 'column',
                    gap: 2,
                  }}
                  size="grow"
                  onSubmit={handleSubmit}
                >
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ display: 'flex', gap: 0.5, paddingBottom: 1 }}
                        htmlFor="title"
                      >
                        Title
                        <Typography fontSize="12" color="error">
                          *
                        </Typography>
                      </FormLabel>
                      <TextField
                        // error={emailError}
                        // helperText={emailErrorMessage}
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Spooky Task"
                        autoFocus
                        required
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formData.title}
                        disabled={!isEditMode}
                        onChange={handleChange}
                        // color={emailError ? 'error' : 'primary'}
                        sx={{ ariaLabel: 'title' }}
                      />
                    </FormControl>
                  </Grid2>
                  <FormControl>
                    <FormLabel
                      htmlFor="decription"
                      sx={{ display: 'flex', gap: 0.5, paddingBottom: 1 }}
                    >
                      Description
                    </FormLabel>
                    <TextField
                      multiline
                      id="description"
                      type="text"
                      name="description"
                      placeholder="No more than 100 words :)"
                      size="small"
                      variant="outlined"
                      rows={4}
                      value={formData.description}
                      disabled={!isEditMode}
                      onChange={handleChange}
                      // color={emailError ? 'error' : 'primary'}
                      sx={{ ariaLabel: 'description' }}
                    />
                  </FormControl>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <FormLabel
                        htmlFor="deadline"
                        sx={{ display: 'flex', gap: 0.5, paddingBottom: 1 }}
                      >
                        Deadline
                        <Typography fontSize="12" color="error">
                          *
                        </Typography>
                      </FormLabel>
                      <TextField
                        name="deadline"
                        id="deadline"
                        required
                        fullWidth
                        type="date"
                        size="small"
                        onChange={handleChange}
                        disabled={!isEditMode}
                        value={formData.deadline}
                      />
                    </FormControl>
                  </Grid2>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="favorite"
                        id="favorite"
                        icon={<FavoriteBorder />}
                        checked={formData.favorite}
                        onChange={handleChange}
                        disabled={!isEditMode}
                        checkedIcon={<Favorite color="error" />}
                      />
                    }
                    label="Mark as favorite"
                  />
                  <Box sx={{ display: 'flex', pt: 2 }}>
                    <ActionButtons />
                  </Box>
                </Grid2>
                <Grid2
                  size={4}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    px: 2,
                    py: 3,
                    gap: 2,
                    display: 'flex',
                    flexFlow: 'column',
                  }}
                >
                  <Stack flexDirection="row" alignItems="center">
                    <Typography>Date</Typography>
                    <Typography sx={{ ml: 'auto' }}>Today</Typography>
                  </Stack>
                  <Stack flexDirection="row" alignItems="center">
                    <Typography>Board</Typography>
                    <Typography sx={{ ml: 'auto' }}>{boardId}</Typography>
                  </Stack>
                  <Stack flexDirection="row" alignItems="center">
                    <Typography>Assignee</Typography>
                    <Typography sx={{ ml: 'auto' }}>You</Typography>
                  </Stack>
                </Grid2>
              </Grid2>
            )}
          </Box>
        </Box>
      )}
    </Modal>
  )
}

interface ReadOnlyModeProps {
  formData: Item
  onEdit: () => void
  onDelete: () => void
}
function ReadOnlyMode(props: ReadOnlyModeProps) {
  const { formData, onEdit, onDelete } = props

  return (
    <>
      <Pill>
        <Typography id="modal-modal-title" variant="caption">
          {formData.boardId}
        </Typography>
      </Pill>
      <Typography minHeight={200} marginBlock={2}>
        {formData.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
        <AccessTimeIcon />
        <Typography color="warning">{formData.deadline}</Typography>
      </Box>
      <Box sx={{ py: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onEdit}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={onDelete}>
          Delete
        </Button>
      </Box>
    </>
  )
}

export default NewTaskModal
