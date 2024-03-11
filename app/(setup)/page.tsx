import InitialModal from "@/components/Modals/InitialModal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import {  Server } from "@prisma/client";
import { redirect } from "next/navigation";

const SetupPage = async () => {
	const profile = await initialProfile();
	const server: Server | null = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});
	if (server) {
		redirect(`/servers/${server.id}`);
	}
	return <InitialModal/>
};

export default SetupPage;
