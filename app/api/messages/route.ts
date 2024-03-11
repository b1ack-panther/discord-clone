import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
	try {
		const profile = await currentProfile();

		const { searchParams } = new URL(req.url);
		const cursor = searchParams.get("cursor");
		const channelId = searchParams.get("channelId");

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!channelId)
			return new NextResponse("channelID missing", { status: 400 });

		let messages: Message[] = [];

		if (cursor) {
			messages = await db.message.findMany({
				take: MESSAGE_BATCH,
				cursor: {
					id: cursor,
				},
				skip: 1,
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
			messages = await db.message.findMany({
				take: MESSAGE_BATCH,
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}

		let nextCursor = null;
		if (messages.length === MESSAGE_BATCH) {
			nextCursor = messages[MESSAGE_BATCH - 1].id;
		}

		return NextResponse.json({
			items: messages,
			nextCursor,
		});
	} catch (error) {
		console.log("messages_error:", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
