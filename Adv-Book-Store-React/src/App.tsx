import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

function App() {
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
