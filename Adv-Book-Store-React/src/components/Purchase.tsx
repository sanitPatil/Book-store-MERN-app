import { fetchPurchaseHistory } from "@/api/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BadgeIndianRupee,
  Check,
  CreditCard,
  CreditCardIcon,
  Cross,
  CrossIcon,
  IndianRupee,
  IndianRupeeIcon,
  X,
} from "lucide-react";

// const [purchaseHistory, setpurchaseHistory] = useState([]);

export function Purchase() {
  const [viewIsModalOpen, setViewIsModalOpen] = useState(false);
  const [paymentModalOpen, setpaymentModalOpen] = useState(false);
  // const [viewIsModalOpen, setViewIsModalOpen] = useState(false);

  const [purchaseHistory, setpurchaseHistory] = useState([]);

  const [total, setTotal] = useState(null);
  const { data, error } = useQuery({
    queryKey: ["get-purchase-book"],
    queryFn: fetchPurchaseHistory,
  });

  useEffect(() => {
    if (data?.data) {
      setpurchaseHistory(data?.data);
      setTotal((prev) => {
        return purchaseHistory
          .map((purchase) => purchase.amount)
          .reduce((acc, curr) => acc + curr, 0);
      });
    }
  }, [data?.data, total]);
  console.log(purchaseHistory);

  return (
    <div className="p-3">
      <h2 className="w-full text-center font-semibold font-mono text-2xl p-2 mb-2 border rounded-lg ">
        Purchase Products list
      </h2>
      {purchaseHistory ? (
        <div className="w-full">
          <Table>
            <TableCaption>A list of your recent purchase...</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] font-bold text-lg text-center  ">
                  <span className="">#</span>
                </TableHead>
                <TableHead className="font-bold text-lg">book Name</TableHead>
                <TableHead className="font-bold text-lg">book Price</TableHead>

                <TableHead className="font-bold text-lg">
                  Payment Mode
                </TableHead>
                <TableHead className="font-bold text-lg">status</TableHead>

                <TableHead className="text-right font-bold text-lg">
                  Amount
                </TableHead>
                <TableHead className="text-right font-bold text-lg">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseHistory.map((purchase, index) => (
                <TableRow key={purchase._id} className="">
                  <TableCell>
                    <img
                      src={purchase.buyBookDetails.bookcoverPage}
                      className=""
                    />
                  </TableCell>
                  <TableCell className="font-bold">
                    {purchase.buyBookDetails.bookName}
                  </TableCell>
                  <TableCell className="font-bold">
                    {purchase.buyBookDetails.bookPrice}{" "}
                    <IndianRupee className="inline w-4 " />
                  </TableCell>

                  <TableCell className="font-bold">
                    {purchase.paymentMode}{" "}
                    <CreditCardIcon className="inline text-blue-800" />
                  </TableCell>
                  <TableCell className="font-bold">
                    {purchase.status ? (
                      <span>
                        "Successful"{" "}
                        <Check className="text-green-500 inline font-bold" />
                      </span>
                    ) : (
                      "failed"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <IndianRupeeIcon className="inline h-4" /> {purchase.amount}
                  </TableCell>
                  <TableCell className=" text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="text-2xl font-bold gap-2">...</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-4">
                        <DropdownMenuLabel>
                          <span
                            onClick={() => setViewIsModalOpen((prev) => !prev)}
                          >
                            View
                          </span>
                        </DropdownMenuLabel>
                        <DropdownMenuLabel>Payment Details</DropdownMenuLabel>
                        <DropdownMenuLabel>Payment Id</DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              <div className="w-full  font-bold m-2  text-right"></div>
            </TableBody>
          </Table>
          <div className="absolute italic right-8 top-56 text-2xl font-bold ">
            <span className="p-4">Total Purchase:</span>
            <span className=" p-2">
              <IndianRupeeIcon className="inline" />
              {total}.00{" "}
            </span>
          </div>
          {viewIsModalOpen && (
            <div className="rounded-lg absolute top-[10%] left-[23%]  border w-[70%] h-[80%] bg-white bg-opacity-75 insent-0 ">
              <div className="w-full text-right">
                <span className="w-full mr-2 mt-1">
                  {" "}
                  <X
                    className="w-8 h-8 inline hover:bg-red-700"
                    onClick={() => setViewIsModalOpen((prev) => !prev)}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
