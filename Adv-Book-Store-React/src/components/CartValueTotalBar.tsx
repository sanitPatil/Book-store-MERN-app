import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useLocalCart } from "@/store/appStore";
import { IndianRupee, MoveRight, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

function CartValueTotalBar() {
  const { bookCart } = useLocalCart((state) => state);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const evalueate = () => {
      let temp = 0;
      bookCart.forEach((book) => {
        if (book.isChecked) {
          temp = temp + book.bookPrice * book.quantity;
        }
      });
      return temp;
    };
    setTotal(evalueate());
  }, [bookCart]);
  return (
    <div className="w-1/4 mt-8 mx-auto flex items-center justify-between">
      {total > 0 ? (
        <div className="">
          Total Price: {total} <IndianRupee className="w-4 h-4 inline" />
        </div>
      ) : (
        <div className="font-bold italic animate-pulse">
          You Have Not Select any item
        </div>
      )}
      <div className="m-2 text-right">
        {total > 0 && (
          <Drawer>
            <DrawerTrigger>
              <Button>Check Out</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-2xl text-center italic font-bold">
                  Please click on Continue to place order...
                </DrawerTitle>
                <DrawerDescription className="text-center">
                  Please follow the given intruction and Don&apos;t Forgot
                  Review...
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid grid-cols-4">
                <div className="w-full col-span-3 ml-4">
                  {bookCart &&
                    bookCart
                      .filter((book) => book.isChecked)
                      .map((book) => (
                        <div
                          className="flex w-full h-24 justify-center "
                          key={book._id}
                        >
                          <img
                            src={book.bookcoverPage}
                            className="w-32 h-16 mr-4 rounded-lg"
                          />
                          <div>
                            Price :{book.bookPrice}{" "}
                            <IndianRupee className="inline w-4 " />
                            <div>Total Order:{book.quantity}</div>
                          </div>
                        </div>
                      ))}
                </div>
                <div>
                  <DrawerFooter className="mr-4">
                    <div className="w-full">
                      <DrawerClose>
                        <Button variant="outline" className="m-4">
                          Cancel <X />
                        </Button>
                      </DrawerClose>
                      <Button className="ml-2">
                        Continue: {total} <IndianRupee />
                      </Button>
                    </div>
                  </DrawerFooter>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}{" "}
      </div>
    </div>
  );
}

export default CartValueTotalBar;
