import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'

const router = createHashRouter(
  [{
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        path: '/plan',
        element: null
      },
      {
        path: '/submission',
        element: null,
      }
    ],
    errorElement: <div>Unknown error occurred...</div>
  }],
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
