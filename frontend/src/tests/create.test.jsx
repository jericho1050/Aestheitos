import { test } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material'
import {
  createBrowserRouter,
  RouterProvider,
  createMemoryRouter
} from "react-router-dom";
import "../index.css";
import "../divider.css"
import Root from '../routes/root';
import ErrorPage from '../error-page';
import SignIn from '../routes/signin';
import SignUp from '../routes/signup';
import { Index, loader as indexLoader } from '../routes/index';
import Course from '../routes/course';
import CreateCourse from '../routes/create';
import {action as createAction} from '../routes/create';
import ProectedRoute from '../helper/protectedRoute';
import { IsLoadingProvider } from '../helper/IsLoadingContext';

const routesArray = [
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
  ]

test('renders without crashing', () => {
    const router = createMemoryRouter(routesArray, {
        initialEntries: ["/course/create"],
    });

  const { container } = render(
    <RouterProvider router={router} />
  )
  expect(container).toBeTruthy()
})

//TODO 
// UNIT TEST --> FUNCTIONS IN COURSE.JS