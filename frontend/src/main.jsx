import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material'


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f72af',
    },
    secondary: {
      main: '#dbe2ef',
    },
    background: {
      default: '#f9f7f7',
    },
  },
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
