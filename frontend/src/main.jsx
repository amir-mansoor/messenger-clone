import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import Test from "./screens/Test";
import { Provider } from "react-redux";
import store from "./store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<HomeScreen />} />

      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route path="/chats" element={<ChatScreen />} />

      <Route path="/test" element={<Test />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>
);
