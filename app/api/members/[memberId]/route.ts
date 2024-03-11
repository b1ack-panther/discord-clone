import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
	req: Request,
	{ params }: { params: { memberId: string } }
) => {
	try {
		const { searchParams } = new URL(req.url);
		const { role } = await req.json();
		const serverId = searchParams.get("serverId");
		const profile = await currentProfile();

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!serverId) return new NextResponse("ServerId missing", { status: 400 });
		if (!params.memberId)
			return new NextResponse("MemberId missing", { status: 400 });

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: { not: profile.id },
						},
						data: {
							role: role,
						},
					},
				},
			},
			include: {
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
		return NextResponse.json(server);
	} catch (error) {
		console.log("[memberId patch: ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
};

export const DELETE = async (
	req: Request,
	{ params }: { params: { memberId: string } }
) => {
	try {
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get("serverId");
		const profile = await currentProfile();

		if (!params.memberId)
			return new NextResponse("MeberId missing", { status: 400 });
		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!serverId) return new NextResponse("ServerId missing", { status: 400 });

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: { not: profile.id },
					},
				},
			},
			include: {
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
    return NextResponse.json(server)
	} catch (error) {
		console.log("[memberId delete: ", error);
		return new NextResponse("internal error", { status: 500 });
	}
};
