import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { uploadBook } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "@/store/appStore";
import { LoaderCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  bookName: z.string().min(4, "name must have 4 character long"),
  bookDescription: z.string(),
  bookPrice: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), { message: "In-valid number" })
    .refine((val) => val >= 1, { message: " price cannot be 0 or less" }),
  bookInStock: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), { message: "In-valid number" })
    .refine((val) => val >= 1, { message: " stock cannot be 0 or less" }),
  bookcoverPage: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }),
  bookFile: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }),
});

function AddBook() {
  const [AddBookError, setAddBookError] = useState("");
  const { toast } = useToast();
  const { userDetails } = useLoginState((state) => state);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: uploadBook,
    onSuccess: (data, variables) => {
      setAddBookError("");
      toast({
        description: "Book Added Successfully! Navigating to Home/All-books",
      });
      navigate("/all-books");
    },
    onError: (err, variables, context) => {
      setAddBookError(err?.response?.data?.message || "failed to publish book");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const addBook = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("bookName", data.bookName);
    formData.append("bookDescription", data.bookDescription);
    formData.append("bookPrice", data.bookPrice);
    formData.append("bookInStock", data.bookInStock);
    formData.append("bookcoverPage", data.bookcoverPage[0]);
    formData.append("bookFile", data.bookFile[0]);
    formData.append("bookOwner", userDetails?._id);
    mutation.mutate(formData);
  };

  return (
    <div className=" p-2 m-2">
      <h1 className="font-bold text-2xl text-center">publish book</h1>
      {AddBookError && (
        <h1 className="font-bold text-2xl text-center italic">
          {AddBookError}
        </h1>
      )}
      {mutation?.isPending ? (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      ) : (
        <form
          onSubmit={handleSubmit(addBook)}
          className="border p-4 mt-4 rounded-2xl"
        >
          <div className="flex flex-col space-y-1.5 p-2">
            <Label htmlFor="bookName">book Title</Label>
            <Input
              id="bookName"
              placeholder="book title "
              {...register("bookName")}
              className="p-2 m-2"
            />
            {errors?.bookName && (
              <span className="text-red-600">{errors?.bookName?.message}</span>
            )}
            <div className="grid grid-cols-2 m-2 p-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bookPrice">Price</Label>
                <Input
                  id="bookPrice"
                  placeholder="book Price In Rupees"
                  type="number"
                  {...register("bookPrice")}
                />
                {errors?.bookPrice && (
                  <span className="text-red-600">
                    {errors?.bookPrice?.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5 ml-2">
                <Label htmlFor="bookInStock">book In Stock</Label>
                <Input
                  id="bookInStock"
                  placeholder="Availability of books"
                  type="number"
                  {...register("bookInStock")}
                />
                {errors?.bookInStock && (
                  <span className="text-red-600">
                    {errors?.bookInStock?.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid w-full gap-1.5 p-2 m-1">
            <Label htmlFor="bookDescription">Description</Label>
            <Textarea
              placeholder="Type your book Description here."
              id="bookDescription"
              {...register("bookDescription")}
            />
            {errors?.bookDescription && (
              <span className="text-red-600">
                {errors?.bookDescription?.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 p-2 m-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bookcoverPage" className="m-1">
                book cover Page image file
              </Label>
              <Input
                id="bookcoverPage"
                type="file"
                placeholder=""
                {...register("bookcoverPage")}
              />
              {errors?.bookcoverPage && (
                <span className="text-red-600">
                  {errors?.bookcoverPage?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5 ml-2">
              <Label htmlFor="bookFile" className="m-1">
                book File book pdfs
              </Label>
              <Input id="bookFile" type="file" {...register("bookFile")} />
              {errors?.bookFile && (
                <span className="text-red-600">
                  {errors?.bookFile?.message}
                </span>
              )}
            </div>
          </div>
          <div className=" flex flex-1 justify-center">
            <Button variant="outline" className="mr-14" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit" className="w-24">
              {mutation.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddBook;
