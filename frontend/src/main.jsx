import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './helper/authContext';
import { ThemeProvider, createTheme } from '@mui/material'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import "./index.css";
import "./divider.css"
import Root from './routes/root';
import ErrorPage from './error-page';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import { Home as CourseList } from './routes/Home';
import Course from './routes/course';

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
        index: true, element: <CourseList/>
      }
    ]
  },
  {
    path:"courses/:courseId",
    element: <Course/>
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
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
