import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  const location = useLocation();

  // Determine the class to apply based on the route
  const isChatScreen = location.pathname === "/chats";
  const appClass = isChatScreen ? "no-container" : "container";
  return (
    <div className={`${appClass} mx-auto`}>
      <Toaster />

      <Outlet />
    </div>
  );
}

export default App;
