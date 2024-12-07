import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndianRupeeIcon, ShoppingBag, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useLocalCart, useLoginState } from "@/store/appStore";
import CartValueTotalBar from "./CartValueTotalBar";
import { useQuery } from "@tanstack/react-query";
import { getBookById, getCartList } from "@/api/api";
import { useNavigate } from "react-router-dom";
function Cart() {
  const { bookCart, removeFromCart } = useLocalCart((state) => state);

  const navigate = useNavigate();

  const getSingleBook = async (id) => {
    const data = await getBookById(id);
    // console.log(data.data);
    const book = data?.data;
    if (book) {
      navigate("/check-out", { state: book });
    } else {
      alert("something went wrong");
    }
  };
  return (
    <div className=" m-4">
      {bookCart?.length > 0 ? (
        <>
          <Table>
            <TableCaption> Buy Books by one-click</TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="font-bold">Select</TableHead> */}
                <TableHead className="font-bold">Book Image</TableHead>
                <TableHead className="font-bold">
                  Amount <IndianRupeeIcon className="w-4 h-4 inline" />
                </TableHead>
                <TableHead className="font-bold">Quantity</TableHead>
                <TableHead className="font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookCart &&
                bookCart?.map((book) => (
                  <TableRow key={book._id}>
                    {/* <TableCell className="font-thin">
                      <div className="flex items-center space-x-2">
                        <HandleCheck book={book} />
                      </div>
                    </TableCell> */}
                    <TableCell className="font-thin">
                      <img
                        src={book.bookcoverPage}
                        className="w-24"
                        alt="book-image"
                      />
                    </TableCell>
                    <TableCell className="font-thin ">
                      {book.bookPrice}
                    </TableCell>
                    <TableCell className="font-thin">
                      <div className="flex items-center space-x-2">
                        <HandleQuantity book={book} />
                      </div>
                    </TableCell>
                    <TableCell className="font-thin">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="default"
                          onClick={() => removeFromCart(book._id)}
                        >
                          <Trash2 />
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => getSingleBook(book._id)}
                        >
                          <ShoppingBag />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <CartValueTotalBar />
        </>
      ) : (
        <div className="w-full  h-full">
          <div className="flex mx-auto justify-center items-center mt-40 space-x-4">
            <h1 className="space-y-2 text-xl font-bold italic animate-pulse">
              Your Cart is Empty...shop now
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

const HandleQuantity = ({ book }) => {
  const { updateCartQuantity, bookCart } = useLocalCart((state) => state);
  const [quan, setQuantity] = useState(book.quantity);

  const Increment = (id) => {
    setQuantity((prev) => {
      const updatedQuantity = prev + 1;
      updateCartQuantity(book._id, updatedQuantity);
      return updatedQuantity;
    });
  };

  const Decrement = (id) => {
    setQuantity((prev) => {
      const updatedQuantity = prev - 1 >= 1 ? prev - 1 : prev;
      updateCartQuantity(book._id, updatedQuantity);
      return updatedQuantity;
    });
  };

  return (
    <div className="flex">
      {" "}
      <Button variant="outline" onClick={() => Decrement(book._id)}>
        -
      </Button>
      <Input type="number" value={quan} disabled className="w-20 text-center" />
      <Button variant="outline" onClick={() => Increment(book?._id)}>
        +
      </Button>
    </div>
  );
};

// const HandleCheck = ({ book }) => {
//   const [checked, setChecked] = useState(book.isChecked);
//   const { bookCart, toggleChecked } = useLocalCart((state) => state);

//   const updateChecked = (id) => {
//     setChecked((prev) => {
//       toggleChecked(id, !prev);
//       return !prev;
//     });
//   };
//   return (
//     <>
//       <Checkbox
//         id="terms"
//         checked={checked}
//         onClick={() => updateChecked(book?._id)}
//       />
//       <label
//         htmlFor="terms"
//         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//       ></label>
//     </>
//   );
// };
