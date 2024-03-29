"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../UserAvatar";
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const MembersModal = () => {
	
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState("");
	const router = useRouter();

	const isModalOpen = isOpen && type === "members";
	const { server } = data;
	const roleMap = {
		GUEST: null,
		MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
		ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
	};

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			// const url = qs.stringifyUrl({
			// 	url: `/api/members/${memberId}`,
			// 	query: {
			// 		serverId: server?.id,
			// 		memberId,
			// 	},
			// });
			const url =
				"/api/members/" +
				memberId +
				"?" +
				new URLSearchParams({ serverId: server?.id ?? "" });

			const response = await axios.patch(url, { role });
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);
			const url =
				`/api/members/${memberId}?` +
				new URLSearchParams({ serverId: server?.id ?? "" });
			const response = await axios.delete(url);
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log("[kick error]: ", error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className=" overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Manage Members
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						{server?.members?.length} members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[420px] mt-8 pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-sm font-semibold flex items-center gap-x-2">
									{member.profile.name} {roleMap[member.role]}
								</div>
								<p className="text-zinc-500 text-xs">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="w-4 h-4 align-middle focus:visible:outline-none" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger>
														<ShieldQuestion className="w-4 h-4 mr-2" />{" "}
														<span>Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() => {
																	onRoleChange(member.id, "GUEST");
																}}
															>
																<Shield className="h4 w-4 mr-2" />
																Guest{" "}
																{member.role === "GUEST" && (
																	<div className="ml-auto">
																		<Check className="h-4 w-4 ml-2" />
																	</div>
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, "MODERATOR")
																}
															>
																<ShieldCheck className="h-4 w-4 mr-2" />{" "}
																Moderator{" "}
																{member.role === "MODERATOR" && (
																	<div className="ml-auto">
																		<Check className="h-4 w-4 ml-2" />
																	</div>
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={()=>{onKick(member.id)}}>
													<Gavel className="w-4 h-4 mr-2 text-rose-500" />
													Kick
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="h-4 w-4 ml-auto text-zinc-500 align-middle animate-spin" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default MembersModal;
