import { createBrowserRouter } from "react-router-dom";
import { Home } from "../features/Home";
import { Login } from "../features/Login";
import { Registration } from "../features/Registration";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "registration",
    element: <Registration />,
  },
]);
