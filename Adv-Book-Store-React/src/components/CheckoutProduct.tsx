import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { IndianRupee, LoaderCircleIcon, Minus, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { pymentOrder } from "@/api/api";

function CheckoutProduct() {
  const location = useLocation();
  const book = location?.state;
  console.log(book);

  const [quantity, setQuantity] = useState(1);

  const { handleSubmit, register, reset } = useForm();

  const mutation = useMutation({
    mutationFn: pymentOrder,
    mutationKey: ["payment-order-session"],
    onSuccess: (data) => {
      // console.log(data);

      stripeCheckout(data.data.id);
    },
  });

  const stripeCheckout = async (id) => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
    const result = stripe?.redirectToCheckout({
      sessionId: id,
    });

    // console.log(result);
  };
  const handlefinalCheckout = async (data) => {
    if (!quantity || !book || !data.name || !data.contact || !data.address) {
      console.error("fields are missing");
      return;
    }
    const finalData = { ...data, quantity, book };

    mutation.mutate({ product: finalData });
  };
  return (
    <>
      {book ? (
        <form onSubmit={handleSubmit(handlefinalCheckout)}>
          <div className="border-none mt-10 m-2 shadow-2xl rounded-xl">
            <div className="grid grid-cols-2 ">
              <div className="">
                <div className="font-bold text-2xl p-2 text-center m-1">
                  {book.bookName}
                </div>
                <div className="grid grid-cols-2 m-2">
                  <div>
                    <img
                      src={book?.bookcoverPage}
                      className="w-56 rounded-lg m-2"
                    />
                  </div>
                  <div className="grid-rows-2 p-2 text-2xl mt-6">
                    <div className="font-semibold">
                      <Label className="mr-2">Book Price:</Label>
                      {book.bookPrice}
                      <IndianRupee className="inline w-8 h-5" />
                    </div>

                    <div className="font-semibold mt-2 ">
                      <Label className="mr-2">Quantity:</Label>
                      <Minus
                        className="inline w-10 "
                        onClick={() =>
                          setQuantity((prev) => {
                            if (prev > 1) {
                              return prev - 1;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                      <Input
                        value={quantity}
                        disabled
                        className="inline w-10 "
                      />
                      <Plus
                        className="inline w-10 "
                        onClick={() =>
                          setQuantity((prev) => {
                            if (prev < book.bookInStock) {
                              return prev + 1;
                            } else {
                              return prev;
                            }
                          })
                        }
                      />
                    </div>
                    <div className="font-semibold mt-2 ">
                      <Label className="mr-2">Book Remainning:</Label>
                      {book?.bookInStock} only
                    </div>
                  </div>
                </div>
              </div>

              <div className="m-2 p-2 mt-4">
                <div>
                  <Label htmlFor="name">Enter Name</Label>
                  <Input id="name" {...register("name")} required />
                </div>
                <div>
                  <Label htmlFor="contact">Enter Contact</Label>
                  <Input maxLength={10} {...register("contact")} />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" {...register("address")} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-center m-2 p-2">
                <div>
                  <Label>selected quantity:</Label> {quantity}
                </div>
                <div>
                  <Label>Total Price:</Label> {quantity * book.bookPrice}{" "}
                  <IndianRupee className="inline w-5" />
                </div>
              </div>
              <div className=" text-center m-2 p-2">
                <Button
                  className="mr-6"
                  variant={"outline"}
                  type="button"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-24"
                  disabled={mutation.isPending}
                >
                  {" "}
                  {mutation.isPending ? (
                    <LoaderCircleIcon className="inline animate-spin " />
                  ) : (
                    " Proceed"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}

export default CheckoutProduct;
