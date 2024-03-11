"use client";
import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	User,
	UserPlus,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

type ServerHeaderProps = {
	server: ServerWithMembersWithProfile;
	role?: MemberRole;
};

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
	const OnOpen = useModal((state) => state.onOpen);
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className=" focus:outline-none" asChild>
				<button className="w-full px-3 h-10 bg-neutral-200 dark:bg-zinc-700 rounded-sm text-base font-semibold flex items-center drop-shadow-lg shadow-zinc-800 hover:bg-zinc-600/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="h-5 w-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="text-xs font-medium w-56 text-black dark:text-neutral-400 space-y-[2px]">
				{isModerator && (
					<DropdownMenuItem
						onClick={() => OnOpen("invite", { server })}
						className="text-indigo-600 dark:text-indigo-400 cursor-pointer px-3 py-2 text-sm"
					>
						Invite People <UserPlus className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => OnOpen("editServer", { server })}
						className=" cursor-pointer px-3 py-2 text-sm"
					>
						Server Settings <Settings className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => OnOpen("members", { server })}
						className=" cursor-pointer px-3 py-2 text-sm"
					>
						Manage Members <User className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => OnOpen("createChannel")}
						className=" cursor-pointer px-3 py-2 text-sm"
					>
						Create Channel <PlusCircle className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && <DropdownMenuSeparator />}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => OnOpen("deleteServer", { server })}
						className="text-rose-500 dark:text-rose-500 cursor-pointer px-3 py-2 text-sm"
					>
						Delete Server <Trash className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						onClick={() => OnOpen("leaveServer", { server })}
						className="text-rose-500 dark:text-rose-500 cursor-pointer px-3 py-2 text-sm"
					>
						Leave Server <LogOut className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ServerHeader;
