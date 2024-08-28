import { useEffect, useReducer, useRef } from 'react'
import { Actions, Board } from '../types'
import { cacheKeyForBoards, DEFAULT_STATE, NEW_BOARD } from '../constants'

function reducer(state: Board[], action: Actions): Board[] {
  if (action.type === 'edit-board') {
    const { field, value, id } = action.payload

    const boardIdx = state.findIndex((board) => board.id === id)
    const dupeState = [...state]
    dupeState[boardIdx][field] = value

    return dupeState
  } else if (action.type === 'add-board') {
    const newBoard: Board = { ...NEW_BOARD, items: [] }
    newBoard.id = Date.now()

    const isDuplicate =
      state.findIndex((board) => board.id === newBoard.id) !== -1

    if (isDuplicate) {
      return state
    }

    return [...state, newBoard]
  } else if (action.type === 'delete-board') {
    const { id } = action.payload

    return state.filter((board) => board.id !== id)
  } else if (action.type === 'upsert-item') {
    const { item } = action.payload

    const boardIdx = state.findIndex((board) => board.id === item.boardId)

    const isValidBoard = boardIdx !== -1

    if (!isValidBoard) {
      return state
    }

    const board = { ...state[boardIdx] }

    const itemIdx = board.items.findIndex((_item) => _item.id === item.id)
    const hasItem = itemIdx !== -1
    if (hasItem) {
      board.items[itemIdx] = { ...item }
    } else {
      board.items.push({ ...item })
    }

    state[boardIdx] = board

    return [...state]
  } else if (action.type === 'delete-item') {
    const { itemId, boardId } = action.payload

    const boardIdx = state.findIndex((board) => board.id === boardId)
    const isValidBoard = boardIdx !== -1

    if (!isValidBoard) {
      return state
    }

    const board = { ...state[boardIdx] }
    const itemIdx = board.items.findIndex((item) => item.id === itemId)
    const hasItem = itemIdx !== -1

    if (!hasItem) {
      return state
    }

    board.items = board.items.filter((item) => item.id !== itemId)
    state[boardIdx] = board

    return [...state]
  }
  return state
}

function init(): Board[] {
  const cache = localStorage.getItem(cacheKeyForBoards)

  if (!cache) {
    localStorage.setItem(cacheKeyForBoards, JSON.stringify(DEFAULT_STATE))
    return DEFAULT_STATE
  }

  return JSON.parse(cache)
}

function useBoards(): [Board[], React.Dispatch<Actions>] {
  const [boards, dispatch] = useReducer(reducer, undefined, init)
  const boardsRef = useRef(boards)

  useEffect(() => {
    boardsRef.current = boards
  }, [boards])

  useEffect(() => {
    function cacheState() {
      localStorage.setItem(cacheKeyForBoards, JSON.stringify(boardsRef.current))
    }

    window.addEventListener('beforeunload', cacheState)
    return () => {
      window.removeEventListener('beforeunload', cacheState)
    }
  }, [])

  return [boards, dispatch]
}

export default useBoards
