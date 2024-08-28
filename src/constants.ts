import { Board } from './types'

const cacheKeyForBoards = 'boards'

const NEW_BOARD: Board = {
  name: 'Untitled',
  description: 'Add things that you might forget',
  id: Date.now(),
  items: [],
}

const DEFAULT_STATE: Board[] = [NEW_BOARD]

export { cacheKeyForBoards, NEW_BOARD, DEFAULT_STATE }
