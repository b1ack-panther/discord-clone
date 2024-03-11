import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const serverIdPage = async ({ params }: { params: { serverId: string } }) => {
	const profile = await currentProfile();
	if (!profile) redirectToSignIn();

	const server = await db.server.findUnique({
		where: {
			id: params?.serverId,
			members: {
				some: {
					profileId: profile?.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChannel = server?.channels[0];
	if (initialChannel?.name !== "general") return null;

	return redirect(`/servers/${server?.id}/channels/${initialChannel.id}`)

 };

export default serverIdPage;
