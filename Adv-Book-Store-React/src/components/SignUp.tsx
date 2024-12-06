import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "@/api/api";
import { EyeIcon, EyeOff, Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalCart } from "@/store/appStore";

const formSchema = z.object({
  name: z.string().min(4, "name must have 4 character long"),
  username: z.string().regex(/^[^\s]*$/, "username must not contain space"),
  email: z.string().email("please enter valid email id"),
  password: z.string().min(6, "password must have 6 character long"),
  avatar: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }),
});
function SignUp() {
  const [signInError, setSignInError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      setSignInError("");
      toast({
        description: "Successfully Register User, Navigate to Login Page",
      });
      navigate("/sign-in");
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

  const registerUser = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);

    mutation.mutate(formData);
  };
  return (
    <Card className="mx-auto w-96  border-purple-500 shadow-purple-700 ">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create Account by entering following Details
          {signInError && `${signInError}`}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(registerUser)}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2">
              <div className="grid gap-2 mr-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="jhon doe"
                  required
                  {...register("name")}
                  aria-invalid={errors?.name ? "true" : "false"}
                />
                {errors?.name && (
                  <span className="text-red-600">{errors?.name?.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="jhon123"
                  required
                  {...register("username")}
                  aria-invalid={errors?.username ? "true" : "false"}
                />
                {errors?.username && (
                  <span className="text-red-600">
                    {errors?.username?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="grid gap-2 mr-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                  aria-invalid={errors?.email ? "true" : "false"}
                />
                {errors?.email && (
                  <span className="text-red-600">{errors?.email?.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link to={""} className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
                </div>
                {isVisible ? (
                  <EyeIcon
                    className="absolute top-64 right-96 mr-8 w-5"
                    onClick={() => setIsVisible((prev) => !prev)}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-64 right-96 mr-8 w-5"
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
                  <span className="text-red-600">
                    {errors?.password?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">avatar</Label>
              <Input
                id="avatar"
                type="file"
                required
                className="bg-gray-50"
                {...register("avatar")}
                aria-invalid={errors?.avatar ? "true" : "false"}
              />
              {errors?.avatar && (
                <span className="text-red-600">{errors?.avatar?.message}</span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Register"
              )}
            </Button>

            {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={"/sign-in"} className="underline text-blue-800">
              Sign In
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default SignUp;
