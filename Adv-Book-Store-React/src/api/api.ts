import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// intercepter

api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
  const login = localStorage.getItem("login-user");
  try {
    const state = login ? JSON.parse(login) : null;
    const token = state?.state?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});
// Get all books
export const getAllBooks = async () => {
  try {
    const response = await api.get("/api/v1/books/all-books");
    return response.data;
  } catch (err) {
    console.error("Error fetching books:", err.response?.data || err.message);
    throw err;
  }
};

interface SingIn {
  email: string;
  password: string;
}
export const signInUser = async (data: SingIn) => {
  try {
    const response = await api.post("/api/v1/users/sign-in", data);
    return response.data;
  } catch (err) {
    console.error(
      "Error signing in user:",
      err?.response?.data || err?.message
    );
    throw err;
  }
};

export const signUpUser = async (data: FormData) => {
  try {
    const response = await api.post("api/v1/users//sign-up", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error registering new user",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

export const uploadBook = async (data: FormData) => {
  try {
    const response = await api.post("/api/v1/books/upload-book", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error Failed to AddBook`,
      error?.response?.data || error?.message
    );
    throw error;
  }
};

export const cartSave = async (data) => {
  try {
    console.log(data);

    const response = await api.post("/api/v1/cart/save-cart", data);
    return response.data;
  } catch (error) {
    console.error(`Error failed to save cart-list`);
    throw error;
  }
};

export const getCartList = async () => {
  try {
    const response = await api.get(`/api/v1/cart/get-cart`);

    return response.data;
  } catch (error) {
    console.error(`Error failed to get list`);
    throw error;
  }
};

export const checkOutSingle = async (data) => {
  try {
    const response = await api.post(`/api/v1/pay-order/checkout`, data);
    return response.data;
  } catch (error) {
    console.error(`failed to checkout`);
    throw error;
  }
};
