import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./styles/index.scss"
import { Provider } from 'react-redux'
import { reduxStore } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from "./socket/socket.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SocketProvider>
        <Provider store={reduxStore}>
          <App />
          <Toaster />
        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
