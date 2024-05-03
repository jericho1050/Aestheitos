import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider, createTheme } from '@mui/material'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import "./index.css";
import "./divider.css"
import Root from './routes/root';
import ErrorPage from './error-page';
import SignIn from './routes/signin';
import SignUp from './routes/signup';
import { Index, loader as indexLoader } from './routes/index';
import Course from './routes/course';
import CreateCourse from './routes/create';
import {action as createAction} from './routes/create';
import ProectedRoute from './components/protectedRoute';
import { IsLoadingProvider } from './contexts/IsLoadingContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
    },
    secondary: {
      main: '#FFC55C',
    },
    background: {
      default: '#f9f7f7',
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "courses/:courseId",
        element: <Course />
      },
      {
       
        element: <ProectedRoute />,
        children: [
          {
          path: "course/create",
          element: <CreateCourse />,
          action: createAction
          },
          // {
          //   path: "course/create/edit",
          //   action: createAction
          // }
        ]
      }
    ],
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/signin",
    element: <SignIn />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <IsLoadingProvider>
        <RouterProvider router={router} />
        </IsLoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
