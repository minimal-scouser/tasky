import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import NewTaskModal from './NewTaskModal'

function Root() {
  const routes = [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'new-task',
          element: <NewTaskModal />,
        },
        {
          path: 'task',
          element: <NewTaskModal />,
        },
      ],
    },
    {
      path: 'about',
      element: <div>About</div>,
    },
  ]
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default Root
