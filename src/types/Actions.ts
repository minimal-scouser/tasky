import Item from './Item'

type Actions =
  | { type: 'add-board' }
  | {
      type: 'edit-board'
      payload: {
        field: 'name' | 'description'
        value: string
        id: number
      }
    }
  | { type: 'delete-board'; payload: { id: number } }
  | { type: 'sort-board'; payload: { id: number } }
  | { type: 'get-boards' }
  | {
      type: 'upsert-item'
      payload: {
        item: Item
      }
    }
  | {
      type: 'edit-item'
      payload: {
        item: Item
      }
    }
  | {
      type: 'delete-item'
      payload: {
        itemId: number
        boardId: number
      }
    }

export default Actions
