import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react"; // Using icons from Lucide (built-in support in ShadCN)
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <CheckCircle className="text-green-500 w-16 h-16" />
      <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
      <p className="text-gray-600 mt-2 text-center">
        Thank you for your purchase. Your payment was successful, and your order
        is being processed.
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => navigate("/purchase")}>View Order</Button>
        <Button variant="outline" onClick={() => navigate("/all-books")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
