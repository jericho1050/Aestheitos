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
import Root, { action as rootAction, loader as rootLoader } from './routes/root';
import ErrorPage from './error-page';
import SignIn from './routes/signin';
import SignUp from './routes/signup';
import { Index, loader as indexLoader } from './routes/index';
import Course, { loader as courseLoader } from './routes/course';
import CreateCourse from './routes/create';
import { action as createAction } from './routes/create';
import { action as enrollAction } from './routes/course';
import ProectedRoute from './components/protectedRoute';
import { IsLoadingProvider } from './contexts/IsLoadingContext';
import EditCourse from './routes/edit';
import { loader as editCourseLoader, action as editAction } from './routes/edit';
import { Pending } from './routes/pending';
import { loader as pendingCoursesLoader } from './routes/pending';

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
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "course/:courseId",
        element: <Course />,
        loader: courseLoader,
        action: enrollAction
      },
      {

        element: <ProectedRoute />,
        children: [
          {
            path: "course/create",
            element: <CreateCourse />,
            action: createAction
          },
          {
            path: "course/:courseId/edit",
            element: <EditCourse />,
            loader: editCourseLoader,
            action: editAction

          },
          {
            path: "pending",
            element: <Pending />,
            loader: pendingCoursesLoader
          }
        ]
      }
    ],
  },
  // if you're wondering why I didn't use react-router's action route.
  // yes, i was dumb, i overlooked it and i think i was still studying react-router when implementing the signUp and signIn routes
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
