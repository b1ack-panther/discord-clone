import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		if (!params.serverId)
			return new NextResponse("Server ID missing", { status: 400 });
		const profile = await currentProfile();
		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		const { imageUrl, serverName } = await req.json();
		console.log("req", req);

		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: { imageUrl, name: serverName },
		});
		return NextResponse.json(server);
	} catch (error) {
		console.log("[SERVER_PATCH_ERROR:", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		
    const server = await db.server.delete({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[delete server]: ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
