import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { channelName, type } = await req.json();
		const profile = await currentProfile();
		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get("serverId");

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!serverId)
			return new NextResponse("Server Id missing", { status: 400 });

		if (channelName === "general")
			return new NextResponse("Name can not be 'general'", { status: 400 });

    console.log("channelName", channelName, "type", type)

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
					},
				},
			},
			data: {
				channels: {
					create: 
						{
							profileId: profile.id,
							name: channelName,
							channelType: type,
						},
					
				},
			},
		});
		
    return NextResponse.json(server);
	} catch (error) {
		console.log("[create channel: ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
