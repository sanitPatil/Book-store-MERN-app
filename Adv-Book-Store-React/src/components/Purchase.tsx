import { fetchPurchaseHistory } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// const [purchaseHistory, setpurchaseHistory] = useState([]);

export default function Purchase() {
  const [purchaseHistory, setpurchaseHistory] = useState([]);
  const { data, error } = useQuery({
    queryKey: ["get-purchase-book"],
    queryFn: fetchPurchaseHistory,
  });

  useEffect(() => {
    if (data?.data) setpurchaseHistory(data?.data);
    console.log(data?.data);
  }, [data?.data]);
  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
    //   <Table>
    //     <TableHeader>
    //       <TableRow>
    //         <TableHead>Product</TableHead>
    //         <TableHead>Date</TableHead>
    //         <TableHead>Quantity</TableHead>
    //         <TableHead>Total Amount</TableHead>
    //         <TableHead>Status</TableHead>
    //         <TableHead>Action</TableHead>
    //       </TableRow>
    //     </TableHeader>
    //     <TableBody>
    //       {purchaseHistory.map((purchase) => (
    //         <TableRow key={purchase.id}>
    //           <TableCell>{purchase.productName}</TableCell>
    //           <TableCell>{purchase.date}</TableCell>
    //           <TableCell>{purchase.quantity}</TableCell>
    //           <TableCell>{purchase.totalAmount}</TableCell>
    //           <TableCell>
    //             <Badge
    //               variant={
    //                 purchase.status === "fulfilled"
    //                   ? "success"
    //                   : purchase.status === "pending"
    //                   ? "warning"
    //                   : "destructive"
    //               }
    //             >
    //               {purchase.status.charAt(0).toUpperCase() +
    //                 purchase.status.slice(1)}
    //             </Badge>
    //           </TableCell>
    //           <TableCell>
    //             <Button variant="secondary" size="sm">
    //               View Details
    //             </Button>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </div>
    <div>hello world</div>
  );
}
