"use client"
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logoutbutton from './Logoutbutton';
const Userbutton = () => {
    const user=useCurrentUser()
   return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={cn("relative rounded-full")}>
          <Avatar>
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-red-500">
              <User className="text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

    <DropdownMenuContent className="mr-4">
      <DropdownMenuItem>
        <span>
          {user?.email}
        </span>
      </DropdownMenuItem>
      <DropdownMenuSeparator/>
        <Logoutbutton>
            <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2"/>
                LogOut
            </DropdownMenuItem>
        </Logoutbutton>
    </DropdownMenuContent>

    </DropdownMenu>
  );
};

export default Userbutton