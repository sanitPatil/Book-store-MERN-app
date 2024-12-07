import { getAllBooks } from "@/api/api";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { useLocalCart } from "@/store/appStore";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";

// function start

export function AllBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  const { toast } = useToast();
  const { addToCart } = useLocalCart((state) => state);
  const { data, error, isPending } = useQuery({
    queryKey: ["get-Alll-Data"],
    queryFn: getAllBooks,
    staleTime: 10000,
  });

  useEffect(() => {
    if (data) {
      setBooks(data?.data);
    }
  }, [data]);

  const Cart = (book) => {
    addToCart({
      _id: book._id,
      bookcoverPage: book.bookcoverPage,
      bookPrice: book.bookPrice,
      isChecked: true,
      quantity: 1,
    });
    toast({
      description: "Book added to Cart successFully!",
    });
  };

  // checkout
  const checkoutHandler = (book) => {
    navigate("/check-out", { state: book });
  };
  return (
    <>
      {isPending ? (
        <div className="w-full p-6 flex justify-center">
          <div className="flex flex-col space-y-3  p-4">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <h1 className="text-center font-bold text-xl animate-pulse">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <>
          {error ? (
            <div className="w-full p-6 flex justify-center">
              <div className="text-red-700 font-bold text-2xl italic">
                {" "}
                {error?.response?.data?.message}
              </div>
            </div>
          ) : (
            <div className="flex m-4 ">
              {books &&
                books.map((book) => (
                  <div className="w-[350px] m-4" key={book?._id}>
                    <img
                      className="h-64 w-full align-middle rounded-lg shadow-md p-1"
                      src={book.bookcoverPage}
                    />

                    <div className="text-center p-2 font-bold">
                      {book?.bookName}
                    </div>
                    <div className=" w-full p-2">
                      {book?.bookDescription.length > 100
                        ? `${book?.bookDescription.substring(0, 100)}`
                        : book?.bookDescription}
                    </div>

                    <div className="flex justify-between m-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => Cart(book)}
                      >
                        Add To <ShoppingCartIcon />
                      </Button>
                      {book?.bookInStock > 0 ? (
                        <Button onClick={() => checkoutHandler(book)}>
                          Buy: {`${book?.bookPrice}`} <IndianRupee />{" "}
                          <ShoppingBagIcon />
                        </Button>
                      ) : (
                        <span className="text-red-700 ">Out of Stock</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
