"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";


function UserDropdown() {
  const user = {
    name: "Sayan Manna",
    email: "sayanmanna@gmail.com",
  };
  const router = useRouter();
  const handleSignOut = () => {
    router.push("sign-in");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-400 hover:text-blue-400"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-200 hover:text-blue-600">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-gray-800 border-gray-700"
      >
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

        <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
        <nav className="sm:hidden text-gray-400">
          <NavItems />
        </nav>
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-white font-medium focus:bg-transparent focus:text-blue-600 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 hidden sm:block" />
          LogOut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
