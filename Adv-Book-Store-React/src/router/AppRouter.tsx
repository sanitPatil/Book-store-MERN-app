import App from "@/App";
import AddBook from "@/components/AddBook";
import { AllBooks } from "@/components/AllBooks";
import Cart from "@/components/Cart";
import { LoginForm } from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import WelcomeMessage from "@/components/WelcomMessage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <WelcomeMessage />,
      },

      {
        path: "/all-books",
        element: <AllBooks />,
      },
      {
        path: "/sign-in",
        element: <LoginForm />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/add-book",
        element: <AddBook />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);

export { router };
