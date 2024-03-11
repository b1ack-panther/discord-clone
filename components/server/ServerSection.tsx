"use client"

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../ActionTooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Plus, Settings } from "lucide-react";

interface ServerSectionProps {
	label: string;
	sectionType: "members" | "channels";
	channelType?: ChannelType;
	role?: MemberRole;
	server?: ServerWithMembersWithProfile;
}

const ServerSection = ({
	label,
	sectionType,
	channelType,
	role,
	server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  

	return (
		<div className="flex items-center justify-between pt-3 pb-2">
			<span className="font-semibold cursor-default text-xs text-zinc-500 dark:text-zinc-300 uppercase">
				{label}
			</span>
			{role !== MemberRole.GUEST && sectionType === "channels" && (
				<ActionTooltip label="Create Channel" side="top">
					<button
						onClick={() => onOpen("createChannel", {channelType})}
						className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400"
					>
						<Plus className="h-4 w-4 " />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="Manage Members" side="top">
					<button
						onClick={() => onOpen("members", { server })}
						className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400"
					>
						<Settings className="h-4 w-4 " />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};

export default ServerSection;
