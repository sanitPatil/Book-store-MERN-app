import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { useLoginState } from "./store/appStore";

function App() {
  const { loginStatus } = useLoginState((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loginStatus) {
      navigate("/sign-in");
    }
  }, [loginStatus, navigate]);
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />

          <Outlet />
        </main>
        <Toaster />
      </SidebarProvider>
    </>
  );
}
export default App;
