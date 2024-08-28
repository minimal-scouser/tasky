import { StrictMode } from 'react'
import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Root } from '../ui'

describe('item interaction', () => {
  test('board with no items', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boards = screen.getAllByTestId('board')
    expect(boards.length).toEqual(1)

    const board = boards[0]
    expect(board.querySelectorAll("div[data-testid='item']").length).toEqual(0)
  })

  test('add, view, edit and delete an item', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const addItemBtn = screen
      .queryAllByRole('button')
      .find((button) => button.querySelector('p')?.textContent === 'Add item')

    await userEvent.click(addItemBtn!)
    expect(location.pathname).toEqual('/new-task')

    let modal = screen.getByRole('presentation')
    let form = modal.querySelector('form')
    const itemTitle = form?.querySelector("input[name='title']")
    const itemDescription = form?.querySelector("textarea[name='description']")
    const itemDeadline = form?.querySelector("input[name='deadline']")
    const itemFavorite = form?.querySelector("input[name='favorite']")

    await userEvent.type(itemTitle!, 'get up')
    await userEvent.type(itemDescription!, 'by 8am')
    await userEvent.type(itemDeadline!, '2022-09-09')
    await userEvent.click(itemFavorite!)

    // add assertions
    expect(itemTitle).toHaveValue('get up')
    expect(itemDescription).toHaveValue('by 8am')
    expect(itemDeadline).toHaveValue('2022-09-09')
    expect(itemFavorite).toBeChecked()

    await userEvent.click(modal!.querySelector('button')!)
    expect(location.pathname).toEqual('/')

    const item = screen.getByTestId('item')
    expect(item.querySelector('p')).toHaveTextContent('get up')

    // view assertions
    const viewItemBtn = item.querySelector("[role='button']")
    await userEvent.click(viewItemBtn!)

    modal = screen.getByRole('presentation')
    expect(modal.querySelector('h2')?.textContent).toEqual('get up')
    expect(modal.querySelector("input[type='checkbox']")).toBeChecked()
    expect(modal.querySelector('p')).toHaveTextContent('by 8am')
    expect(
      modal.querySelector("svg[data-testid='AccessTimeIcon']")?.nextSibling
    ).toHaveTextContent('2022-09-09')

    // edit assertions
    const editItemBtn = Array.from(modal.querySelectorAll('button')).find(
      (button) => button.textContent === 'Edit'
    )
    await userEvent.click(editItemBtn!)

    modal = screen.getByRole('presentation')
    form = modal.querySelector('form')

    await userEvent.type(form?.querySelector("input[name='title']")!, ' by 8am')
    await userEvent.clear(form?.querySelector("textarea[name='description']")!)
    await userEvent.type(
      form?.querySelector("textarea[name='description']")!,
      'and have a cuppa coffee'
    )
    await userEvent.clear(form?.querySelector("input[name='deadline']")!)
    await userEvent.type(
      form?.querySelector("input[name='deadline']")!,
      '2024-09-19'
    )
    await userEvent.click(form?.querySelector("input[name='favorite']")!)

    expect(form?.querySelector("input[name='title']")!).toHaveValue(
      'get up by 8am'
    )
    expect(form?.querySelector("textarea[name='description']")!).toHaveValue(
      'and have a cuppa coffee'
    )
    expect(form?.querySelector("input[name='deadline']")!).toHaveValue(
      '2024-09-19'
    )
    expect(form?.querySelector("input[name='favorite']")!).not.toBeChecked()

    const saveItemBtn = form?.querySelector("button[type='submit']")
    await userEvent.click(saveItemBtn!)

    expect(location.pathname).toEqual('/')
    expect(screen.getByTestId('item').querySelector('p')).toHaveTextContent(
      'get up by 8am'
    )

    // delete assertions
    await userEvent.click(
      screen.getByTestId('item').querySelector("[role='button']")!
    )
    expect(location.pathname).toEqual('/task')

    const deleteBtn = Array.from(
      screen.getByRole('presentation').querySelectorAll('button')
    ).find((button) => button.textContent === 'Delete')
    await userEvent.click(deleteBtn!)

    expect(location.pathname).toEqual('/')
    expect(screen.queryByTestId('item')).not.toBeInTheDocument()
  })
})
