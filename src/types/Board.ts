import Item from './Item'

type Board = {
  name: string
  description?: string
  id: number
  items: Item[]
}

export default Board
