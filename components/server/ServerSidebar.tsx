import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";

type ServerSidebarProps = {
	serverId: string;
};
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	const profile = await currentProfile();
	if (!profile) {
		return redirect("/");
	}
	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	});

	if (!server) redirect("/");

	const textChannels = server.channels.filter(
		(channel) => channel.channelType === ChannelType.TEXT
	);
	const audioChannels = server.channels.filter(
		(channel) => channel.channelType === ChannelType.AUDIO
	);
	const videoChannels = server.channels.filter(
		(channel) => channel.channelType === ChannelType.VIDEO
	);
	const members = server.members.filter(
		(member) => member.profileId !== profile?.id
	);

	const role = server.members.find(
		(member) => member.profileId === profile?.id
	)?.role;

	const iconMap = {
		[ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
		[ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
		[ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
	};

	const roleIconMap = {
		[MemberRole.GUEST]: null,
		[MemberRole.MODERATOR]: (
			<ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
		),
		[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500				" />,
	};

	return (
		<div className="flex flex-col h-full dark:bg-[#2B2D31] text-primary bg-[#F2F3F5] w-full">
			 <ServerHeader server={server} role={role} /> 
			<ScrollArea className="px-2 flex-1">
				<div className="mt-2">
					 <ServerSearch
						data={[
							{
								label: "Text Channels",
								type: "channel",
								data: textChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.channelType],
								})),
							},
							{
								label: "Voice Channels",
								type: "channel",
								data: audioChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.channelType],
								})),
							},
							{
								label: "Video Channels",
								type: "channel",
								data: videoChannels.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.channelType],
								})),
							},
							{
								label: "Members",
								type: "member",
								data: members.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/> 
				</div>
				<Separator className="bg-zinc-200 dark:bg-zinc-600 rounded-md my-2" />
				{!!textChannels?.length && (
					<div className="mb-4">
						 <ServerSection
							sectionType="channels"
							label="Text Channels"
							role={role}
							channelType={ChannelType.TEXT}
						/> 
						{textChannels?.map((channel) => (
							<ServerChannel
								key={channel.id}
								role={role}
								channel={channel}
								server={server}
							/>
						))}
					</div>
				)}

				{!!audioChannels?.length && (
					<div className="mb-4">
						 <ServerSection
							sectionType="channels"
							label="Voice Channels"
							role={role}
							channelType={ChannelType.AUDIO}
						/> 
						{audioChannels?.map((channel) => (
							<ServerChannel
								key={channel.id}
								role={role}
								channel={channel}
								server={server}
							/>
						))}
					</div>
				)}

				{!!videoChannels?.length && (
					<div className="mb-4">
						 <ServerSection
							sectionType="channels"
							label="Video Channels"
							role={role}
							channelType={ChannelType.VIDEO}
						/> 
						{videoChannels?.map((channel) => (
							<ServerChannel
								key={channel.id}
								role={role}
								channel={channel}
								server={server}
							/>
						))}
					</div>
				)}

				{!!members?.length && (
					<div className="mb-4">
						 <ServerSection
							sectionType="members"
							label="Members"
							role={role}
							server={server}
						/> 
						{members?.map((member) => (
							<ServerMember key={member.id} member={member} server={server} />
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
