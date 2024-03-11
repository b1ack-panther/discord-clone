"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ActionTooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfile } from "@/types";

interface ServerChannelProps {
	channel: Channel;
	server: ServerWithMembersWithProfile;
	role?: MemberRole;
}

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
	const params = useParams();
	const router  = useRouter()
	const { onOpen } = useModal();

	const Icon = iconMap[channel.channelType];

	const onClick = () => {
		router.push(`/servers/${server.id}/channels/${channel.id}`)
	}

	const onAction = (e: React.MouseEvent, modalType: ModalType) => {
		e.stopPropagation();
		onOpen(modalType, {server, channel})
	}

	return (
		<button onClick={onClick}
			className={cn(
				"flex items-center gap-x-2 mb-1 p-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md w-full group transition ",
				params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
			)}
		>
			<Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
			<span
				className={cn(
					"text-sm whitespace-nowrap flex-shrink flex justify-start overflow-hidden text-ellipsis  text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.channelId === channel.id &&
						"text-primary dark:text-zinc-200 dark:group-hover:text-white"
				)}
			>
				{channel.name}
			</span>
			{channel.name !== "general" && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2 shrink-0">
					<ActionTooltip className="text-xs" label="Edit" side="top">
						<Edit
							onClick={(e) => onAction(e, "editChannel")}
							className="h-4 w-4 opacity-0 group-hover:opacity-100 transition text-zinc-500 dark:text-zinc-400"
						/>
					</ActionTooltip>
					<ActionTooltip className="text-xs" label="Delete" side="top">
						<Trash
							onClick={(e) => onAction(e, "deleteChannel")}
							className="h-4 w-4 opacity-0 group-hover:opacity-100 transition text-zinc-500 dark:text-zinc-400"
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && (
				<Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400  shrink-0" />
			)}
		</button>
	);
};

export default ServerChannel;
