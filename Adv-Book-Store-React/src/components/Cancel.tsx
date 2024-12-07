import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react"; // Using icons from Lucide
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <XCircle className="text-red-500 w-16 h-16" />
      <h1 className="text-2xl font-bold mt-4">Payment Canceled</h1>
      <p className="text-gray-600 mt-2 text-center">
        It seems your payment was not completed. You can try again or return to
        the shop.
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => navigate("/all-books")}>Back to Shop</Button>
      </div>
    </div>
  );
}
