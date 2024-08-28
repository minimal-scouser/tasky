// import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'

import { StrictMode } from 'react'
import { Root } from '../ui'

describe('initial render', () => {
  test('has main heading', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const heading = screen.getByRole('heading', { level: 5 })
    expect(heading.innerHTML).toBe('Boards')
  })

  test('has atleast one board', async () => {
    render(
      <StrictMode>
        <Root />
      </StrictMode>
    )

    const boards = screen.getAllByTestId('board')
    expect(boards.length).toBeGreaterThanOrEqual(1)
  })
})
