import {
  Calendar,
  Home,
  BookOpen,
  BookUp2,
  CircleFadingPlus,
  ShoppingBag,
  ShoppingCart,
  LogIn,
  LogInIcon,
  UserRoundPlus,
  LogOut,
  LogOutIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useLocalCart, useLoginState } from "@/store/appStore";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cartSave } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

// Menu items.

export function AppSidebar() {
  const [loading, setLoading] = useState(false);
  const { userDetails, loginStatus, LoginStateUpdate } = useLoginState(
    (state) => state
  );
  const { logOutCart, bookCart } = useLocalCart((state) => state);
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: cartSave,
    onSuccess: () => {
      toast({
        description: "Your Cart successfully save on Backing Store",
      });
      setLoading(false);
      LoginStateUpdate(null);
      logOutCart();
      // localStorage.removeItem("login-user");
      // localStorage.removeItem("Cart-data");

      navigate("/");
    },
  });
  const navigate = useNavigate();
  const signOut = () => {
    setLoading(true);
    mutation.mutate({ cartList: bookCart });
  };
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      status: loginStatus,
    },

    {
      title: "All-Books",
      url: "/All-Books",
      icon: BookOpen,
      status: loginStatus,
    },
    {
      title: "Add-Book",
      url: "/add-book",
      icon: BookUp2,
      status: loginStatus,
    },

    {
      title: "cart",
      url: "/cart",
      icon: ShoppingCart,
      status: loginStatus,
    },
    {
      title: "sign-in",
      url: "/sign-in",
      icon: LogInIcon,
      status: !loginStatus,
    },
    {
      title: "Sign-Up",
      url: "/sign-up",
      icon: UserRoundPlus,
      status: !loginStatus,
    },
  ];
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="m-2  my-4">
            <div className="italic font-bold text-xl  w-full text-center animate">
              Charlie&apos;s Book Store...
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) =>
                  item.status && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {loginStatus && (
        <div className="flex w-full mb-2">
          <Avatar className="h-10">
            <AvatarImage
              src={userDetails?.avatar}
              className=" w-12 h-10 border ml-6 mr-4 rounded-full"
            />
            <AvatarFallback>image user</AvatarFallback>
          </Avatar>
          <Button
            variant={"destructive"}
            className="flex items-end"
            onClick={signOut}
          >
            Sign-Out <LogOutIcon />
          </Button>
        </div>
      )}
    </Sidebar>
  );
}
