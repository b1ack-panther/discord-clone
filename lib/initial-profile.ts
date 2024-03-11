import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";
import { Profile } from "@prisma/client";
 
export const initialProfile = async (): Promise<Profile> => {
	const user = await currentUser();
	if (!user) return redirectToSignIn();

	const profile : Profile | null = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});
	if (profile) {
		return profile;
	}

	const newProfile : Profile = await db.profile.create({
		data: {
			userId: user.id,
			name: `${user.firstName} ${user.lastName === "null" ? "": user.lastName}`,
			email: user.emailAddresses[0].emailAddress,
			imageUrl: user.imageUrl,
		},
	});
	return newProfile;
};
