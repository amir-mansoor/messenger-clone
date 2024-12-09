import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatHeader = ({ name, phoneNumber }) => {
  return (
    <div className="backdrop-brightness-125 p-2 flex items-center justify-between">
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-gray-800 text-white h-12 w-12 font-bold text-xl rounded-full">
              {name[0]}
            </div>
            <h1 className="ml-2 text-white">{name}</h1>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <div className="bg-gray-700 text-white h-12 w-12 rounded-full flex items-center justify-center">
                  {name[0]}
                </div>
                <div className="ml-2">
                  <h1>{name}</h1>
                  <p className="mt-2 text-sm">{phoneNumber}</p>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <MoreVertical color="white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 text-white w-[200px]">
          <DropdownMenuItem>Close Chat</DropdownMenuItem>
          <DropdownMenuItem>Delete Chat</DropdownMenuItem>
          <DropdownMenuItem>Report Chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
