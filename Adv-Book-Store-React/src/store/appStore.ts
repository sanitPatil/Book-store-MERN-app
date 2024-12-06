import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  books: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
}

interface LoginState {
  loginStatus: boolean;
  accessToken?: string | null;
  userDetails?: User | null;
  LoginStateUpdate: (data: User | null) => void;
}

const useLoginState = create<LoginState>()(
  persist(
    (set) => ({
      loginStatus: false,
      userDetails: null,
      LoginStateUpdate: (data: User | null) =>
        set(() => ({
          loginStatus: !!data,
          userDetails: data,
          accessToken: data?.accessToken,
        })),
    }),
    {
      name: "login-user",
    }
  )
);

const useLocalCart = create(
  persist(
    (set) => ({
      bookCart: [], // Initial state as an array

      addToCart: (data) =>
        set((state) => {
          const bookExistsInCart = state?.bookCart?.find(
            (item) => item._id === data._id
          );

          if (bookExistsInCart) {
            return {
              bookCart: state?.bookCart?.map((item) =>
                item._id === data._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              bookCart: [...state?.bookCart, { ...data, quantity: 1 }],
            };
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          return {
            bookCart: state?.bookCart?.filter((item) => item._id !== id),
          };
        }),
      updateCartQuantity: (id, value) => {
        set((state) => {
          return {
            bookCart: state?.bookCart?.map((item) =>
              item._id === id ? { ...item, quantity: value } : item
            ),
          };
        });
      },
      toggleChecked: (id, value) => {
        set((state) => {
          return {
            bookCart: state?.bookCart?.map((book) =>
              book._id === id ? { ...book, isChecked: value } : book
            ),
          };
        });
      },
      logOutCart: () => {
        set((state) => {
          return { bookCart: [] };
        });
      },
      logInCart: (data) => {
        set((state) => {
          return { bookCart: data };
        });
      },
    }),
    { name: "Cart-data" }
  )
);

export { useLoginState, useLocalCart };
