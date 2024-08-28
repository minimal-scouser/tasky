import { StrictMode } from 'react'
import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Root } from '../ui'

describe('board interaction', () => {
  test('has name and can update name', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boardNames = screen.getAllByTestId('board-name')
    expect(boardNames.length).toBeGreaterThanOrEqual(1)

    // this assumption is brittle and can hurt in the long run
    const boardName = boardNames[0]
    const initialBoardName = 'Untitled'
    expect(boardName.textContent).toBe(initialBoardName)

    await userEvent.dblClick(boardName)
    expect(boardName).not.toBeInTheDocument()

    const input = screen.getByTestId('board-name-input')
    expect(input).toBeInTheDocument()

    const newBoardNameInput = 'hello'
    await userEvent.type(input, newBoardNameInput)
    expect(input).toHaveValue(initialBoardName + newBoardNameInput)
  })

  test('has an add item button', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boards = screen.getAllByTestId('board')
    const board = boards[0]

    // has a add task button
    const addTaskButton = board.querySelector('button')
    expect(addTaskButton).not.toBe(null)
  })

  test('has options button', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boards = screen.getAllByTestId('board')
    const optionBtns = screen.getAllByLabelText('board-options')

    expect(boards.length).toEqual(optionBtns.length)
  })

  test('add a board', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const addBoardBtn = screen.getByRole('button', {
      name: 'Add Board',
    })

    await userEvent.click(addBoardBtn)
    expect(screen.getAllByTestId('board').length).toEqual(2)
  })

  test('has options', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boards = screen.getAllByTestId('board')
    const boardOptionsBtn = screen.getAllByLabelText('board-options')
    expect(boards.length).toEqual(boardOptionsBtn.length)

    const boardOptionBtn = boardOptionsBtn[0]
    await userEvent.click(boardOptionBtn)

    const boardOptions = screen.getAllByRole('menuitem')
    expect(boardOptions.length).toEqual(3)
  })

  test('delete a board', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const addBoardBtn = screen.getByRole('button', {
      name: 'Add Board',
    })

    await userEvent.click(addBoardBtn)
    expect(screen.getAllByTestId('board').length).toEqual(2)

    const boardOptionsBtn = screen.getAllByLabelText('board-options')
    const boardOptionBtn = boardOptionsBtn[0]

    await userEvent.click(boardOptionBtn)

    const deleteBoardBtns = screen.queryAllByText('Delete')
    expect(deleteBoardBtns.length).toEqual(1)

    const deleteBoardBtn = deleteBoardBtns[0]
    await userEvent.click(deleteBoardBtn)

    expect(screen.getAllByTestId('board').length).toEqual(1)
  })
})
