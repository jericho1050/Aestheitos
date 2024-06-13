import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/authContext";
import { ThemeProvider, createTheme } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./divider.css";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./routes/root";
import ErrorPage from "./error-page";
import SignIn from "./routes/signin";
import SignUp from "./routes/signup";
import { Index, loader as indexLoader } from "./routes/index";
import Course, { loader as courseLoader } from "./routes/course";
import CreateCourse from "./routes/create-course";
import { action as createCourseAction } from "./routes/create-course";
import { action as courseAction } from "./routes/course";
import ProectedRoute from "./components/protectedRoute";
import { IsLoadingProvider } from "./contexts/IsLoadingContext";
import EditCourse from "./routes/edit";
import {
  loader as editCourseLoader,
  action as editAction,
} from "./routes/edit";
import { Pending } from "./routes/pending";
import { loader as pendingLoader } from "./routes/pending";
import Profile from "./routes/profile";
import { loader as profileLoader } from "./routes/profile";
import Enrolled, { loader as enrolledLoader } from "./routes/enrolled";
import CreateBlog, { action as createBlogAction } from "./routes/create-blog";
import Blogs, { loader as blogsLoader } from "./routes/blogs";
import Blog, { loader as blogLoader } from "./routes/blog";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#FFC55C",
    },
    background: {
      default: "#f9f7f7",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
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
            action: courseAction,
          },
          {
            path: "profile/user/:userId",
            element: <Profile />,
            loader: profileLoader,
          },
          {
            path: "blogs",
            element: <Blogs />,
            loader: blogsLoader,
          },
          {
            path: "blog/:blogId",
            element: <Blog />,
            loader: blogLoader,
          },
        ],
      },
      {
        element: <ProectedRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "course/create",
            element: <CreateCourse />,
            action: createCourseAction,
          },
          {
            path: "course/:courseId/edit",
            element: <EditCourse />,
            loader: editCourseLoader,
            action: editAction,
          },
          {
            path: "pending",
            element: <Pending />,
            loader: pendingLoader,
          },
          {
            path: "enrolled/user/:userId",
            element: <Enrolled />,
            loader: enrolledLoader,
          },
          {
            path: "blog/create",
            element: <CreateBlog />,
            action: createBlogAction,
          },
        ],
      },
    ],
  },
  // if you're wondering why I didn't use react-router's action route.
  // yes, i was dumb, i overlooked it and i think i was still studying react-router when implementing the signUp and signIn routes
  // so forgive my ignorance
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <IsLoadingProvider>
          <RouterProvider router={router} />
        </IsLoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
