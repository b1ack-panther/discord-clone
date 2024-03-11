import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	const profile = await currentProfile();
	if (!profile) redirectToSignIn();

	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			profileId: profile?.id,
			serverId: params.serverId,
		},
	});

	if (!channel || !member) return redirect("/");

	return (
		<div className="dark:bg-[#313338] bg-white flex flex-col h-screen">
			<ChatHeader
				name={channel.name}
				type="channel"
				serverId={channel.serverId}
			/>
			{channel.channelType === ChannelType.TEXT && (
				<>
					<ChatMessages
						name={channel.name}
						chatId={channel.id}
						type="channel"
						apiUrl="/api/messages"
						socketUrl="/api/socket/messages"
						member={member}
						socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
						paramKey="channelId"
						paramValue={channel.id}
					/>
					<ChatInput
						name={channel.name}
						type="channel"
						apiUrl="/api/socket/messages"
						query={{ channelId: channel.id, serverId: channel.serverId }}
					/>
				</>
			)}
			{channel.channelType === ChannelType.AUDIO && (
				<MediaRoom audio={true} video={false} chatId={channel.id} />
			)}
			{channel.channelType === ChannelType.VIDEO && (
				<MediaRoom audio={true} video={true} chatId={channel.id} />
			)}
		</div>
	);
};

export default ChannelIdPage;
