"use client";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";

interface ServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}
const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
	[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};
const ServerMember = ({ server, member }: ServerMemberProps) => {
	const params = useParams();
	const router = useRouter();

	const icon = roleIconMap[member.role];

	const onClick = () => {
		router.push(`/servers/${server.id}/conversations/${member.id}`);
	};


	return (
		<button
			onClick={onClick}
			className={cn(
				"group p-2 flex items-center gap-x-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 mb-1 transition",
				params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
			)}
		>
			{icon}
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-4 w-4 md:h-6 md:w-6 shrink-0"
			/>
			<span
				className={cn(
					"text-sm text-zinc-500 whitespace-nowrap text-ellipsis overflow-hidden group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.memberId === member.id &&
						"dark:text-zinc-200 text-primary dark:group-hover:text-white"
				)}
			>
				{member.profile.name}
			</span>
		</button>
	);
};

export default ServerMember;
