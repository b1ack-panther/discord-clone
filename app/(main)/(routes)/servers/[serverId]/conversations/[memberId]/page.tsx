import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
	params: {
		serverId: string;
		memberId: string;
	};
	searchParams: {
		video?: boolean;
	};
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
	const { video } = searchParams;

	const profile = await currentProfile();

	if (!profile) redirectToSignIn();

	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile?.id,
		},
		include: {
			profile: true,
		},
	});

	if (!currentMember) redirect("/");

	const conversation = await getOrCreateConversation(
		currentMember.id,
		params.memberId
	);

	if (!conversation) {
		console.log("no conversaton found");
		return redirect(`/servers/${params.serverId}`);
	}

	const { memberOne, memberTwo } = conversation;

	const otherMember =
		profile?.id === memberOne.profileId ? memberTwo : memberOne;

	return (
		<div className="flex flex-col bg-white dark:bg-[#313338] h-full">
			<ChatHeader
				type="conversation"
				serverId={params.serverId}
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
			/>
			{!video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						apiUrl="/api/direct-messages"
						chatId={conversation.id}
						type="conversation"
						paramKey="conversationId"
						paramValue={conversation.id}
						socketQuery={{ conversationId: conversation.id }}
						socketUrl="/api/socket/direct-messages"
					/>
					<ChatInput
						apiUrl="/api/socket/direct-messages"
						name={otherMember.profile.name}
						type="conversation"
						query={{ conversationId: conversation.id }}
					/>
				</>
			)}
			{video && <MediaRoom chatId={conversation.id} audio video />}
		</div>
	);
};

export default MemberIdPage;
