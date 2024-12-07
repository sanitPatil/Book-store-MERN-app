import App from "@/App";
import AddBook from "@/components/AddBook";
import { AllBooks } from "@/components/AllBooks";
import Cart from "@/components/Cart";
import { LoginForm } from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import WelcomeMessage from "@/components/WelcomMessage";
import { createBrowserRouter } from "react-router-dom";
import CheckoutProduct from "@/components/CheckoutProduct";
import Success from "@/components/Success";
import Cancel from "@/components/Cancel";
import Purchase from "@/components/Purchase";
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
      {
        path: "/check-out",
        element: <CheckoutProduct />,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/cancel",
        element: <Cancel />,
      },
      {
        path: "/purchase",
        element: <Purchase />,
      },
    ],
  },
]);

export { router };
