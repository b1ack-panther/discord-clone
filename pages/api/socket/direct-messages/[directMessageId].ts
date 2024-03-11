import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "DELETE" && req.method !== "PATCH") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		const profile = await currentProfilePages(req);
		const { directMessageId, conversationId } = req.query;
		const { content } = req.body;

		if (!profile) return res.status(401).json({ error: "Unauthorized" });
		if (!conversationId)
			return res.status(400).json({ error: "conversationID is missing" });


		const conversation = await db.conversation.findUnique({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
					include: { profile: true },
				},
				memberTwo: {
					include: { profile: true },
				},
			},
		});

		if (!conversation)
			return res.status(404).json({ error: "conversation not found" });

		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo;

		if (!member) return res.status(404).json({ error: "Member not Found" });

		let message = await db.directMessage.findUnique({
			where: {
				id: directMessageId as string,
				conversationId: conversationId as string,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		if(!message || message.delete)return res.status(404).json({error: "Message not found"})

		const isMessageOwner = profile.id === message?.member.profile.id;
		const isAdmin = member.role === MemberRole.ADMIN;
		const isModerator = member.role === MemberRole.MODERATOR;
		const canModify = isMessageOwner || isAdmin || isModerator;

		if (!canModify) return res.status(404).json({ error: "Unauthorized" });

		if (req.method === "DELETE") {
			message = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					fileUrl: null,
					content: "This message has been deleted.",
					delete: true,
				},
				include: {
					member: {
						include: { profile: true },
					},
				},
			});
		}

		if (req.method === "PATCH") {
			if (!isMessageOwner) {
				return res.status(401).json({ error: "Unauthorized" });
			}
			message = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					content,
				},
				include: {
					member: {
						include: { profile: true },
					},
				},
			});
		}

		const updateKey = `chat:${conversationId}:messages:update`;

		res.socket?.server?.io?.emit(updateKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log("direct-message_id error", error);
		return res.status(500).json({ error: "Internal Error" });
	}
}
