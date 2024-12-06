import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getCartList, signInUser } from "@/api/api";
import { useLocalCart, useLoginState } from "@/store/appStore";
import { Check, Eye, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Enter valid Email Address"),
  password: z.string().min(6, "password must have atleast 6 character long"),
});
export function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [singInError, setsingInError] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { LoginStateUpdate, userDetails } = useLoginState((state) => state);
  const { logInCart } = useLocalCart((state) => state);

  const getCart = async () => {
    const res = await getCartList();
    if (res) {
      console.log(res);
      if (res?.data[0]?.cartList) {
        logInCart(res?.data[0]?.cartList);
      } else {
        logInCart([]);
      }
    }
  };

  const { mutate, isPending, reset } = useMutation({
    mutationFn: signInUser,
    onSuccess: async (data) => {
      setsingInError("");
      LoginStateUpdate(data?.data?.user);

      getCart();
      toast({
        description: "Login Successfully!",
      });
      navigate("/all-books");
    },
    onError: (err, variables, context) => {
      setsingInError(err?.response?.data?.message || "failed to login!");
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const loginUser = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <Card className="mx-auto max-w-sm mt-20 border-purple-500 shadow-purple-700 ">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          {singInError ? (
            <div className="text-red-700 font-bold text-center ">
              {" "}
              {singInError}
            </div>
          ) : (
            <div className="italic">
              {" "}
              Enter your email below to login to your account
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(loginUser)}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
                aria-invalid={errors?.email ? "true" : "false"}
              />
              {errors?.email && <span>{errors?.email?.message}</span>}
            </div>
            <div className="grid gap-2 ">
              {/* <div className="flex w-0 h-0 items-center"> */}
              {/* TODO: <Link to={""} className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
              {/* </div> */}
              <div>
                <Label htmlFor="password" className="">
                  Password
                </Label>

                {isVisible ? (
                  <Eye
                    className="relative ml-2 top-8 left-72 "
                    onClick={() => setIsVisible((prev) => !prev)}
                  />
                ) : (
                  <EyeOffIcon
                    className="relative ml-2 top-8 left-72"
                    onClick={() => setIsVisible((prev) => !prev)}
                  />
                )}

                <Input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  required
                  {...register("password", {
                    min: 6,
                  })}
                  aria-invalid={errors?.password ? "true" : "false"}
                />
                {errors?.password && (
                  <span className="text-red-700">
                    {errors?.password?.message}
                  </span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2Icon className="animate-spin" /> : "Login"}
            </Button>
            {/*TODO: <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/sign-up"} className="underline text-blue-800">
              Sign up
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
