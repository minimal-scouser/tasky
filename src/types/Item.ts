type Item = {
  id: number
  boardId: number
  title: string
  description?: string
  deadline: string
  images?: string[]
  status: string
  favorite?: boolean
}

export default Item
