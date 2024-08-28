import { Board, Item } from '../types'

function selectTaskFromBoards(
  boardId: number,
  taskId: number,
  boards: Board[]
): Item | null {
  const boardIdx = boards.findIndex((board) => board.id === boardId)
  if (boardIdx === -1) {
    return null
  }

  const board = boards[boardIdx]
  const taskIdx = board.items.findIndex((item) => item.id === taskId)
  if (taskIdx === -1) {
    return null
  }

  return board.items[taskIdx]
}

export default selectTaskFromBoards
