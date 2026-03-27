"use client";

import  { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import NavItems from "./NavItems";
import { signOut } from "@/lib/actions/auth.actions"; // ✅ Fixed import

type User = {
  id: string;
  name: string;
  email: string;
};

function UserDropdown({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      const result = await signOut(); 

      if (!result?.success) {
        console.error("Sign out failed:");
       
      }

      //  Redirect to sign-in
      router.push("/sign-in");
      router.refresh(); // Clear session state
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {mounted && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-200">
                  {user.name}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 bg-gray-800 border-gray-700"
          >
            {/* User Info */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Mobile Nav - Show on small screens */}
            <div className="sm:hidden">
              <DropdownMenuSeparator className="bg-gray-700" />
              <nav className="text-gray-300">
                <NavItems />
              </nav>
            </div>

            {/* Desktop Separator */}
            <DropdownMenuSeparator className="hidden sm:block bg-gray-700" />

            {/* Logout Button */}
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isLoading} //  Disable while loading
              className="text-gray-200 hover:text-red-400 hover:bg-gray-700 focus:bg-gray-700 focus:text-red-400 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export default UserDropdown;
