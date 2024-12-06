import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.scss";
import { Provider } from "react-redux";
import { reduxStore, persistor } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket/socket.jsx";
import { PersistGate } from "redux-persist/integration/react";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SocketProvider>
        <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster />
          </PersistGate>
        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
