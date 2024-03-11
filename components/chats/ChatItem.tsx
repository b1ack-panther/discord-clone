import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import * as z from "zod";
import qs from "query-string";

import {
	Edit,
	FileIcon,
	MessageCircleWarningIcon,
	ShieldAlert,
	ShieldCheck,
	Trash,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

interface ChatItemProps {
	id: string;
	content: string;
	member: Member & {
		profile: Profile;
	};
	timestamp: string;
	currentMember: Member;
	fileUrl: string | null;
	deleted: boolean;
	isUpdated: boolean;
	socketUrl: string;
	socketQuery: Record<string, string>;
}

const iconRoleMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
	content: z.string().min(1),
});

const ChatItem = ({
	id,
	content,
	member,
	timestamp,
	fileUrl,
	currentMember,
	deleted,
	isUpdated,
	socketUrl,
	socketQuery,
}: ChatItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onOpen } = useModal();
	const params = useParams();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: content,
		},
	});

	const onMemberClick = () => {
		if (member.id === currentMember.id) {
			return;
		}
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};

	useEffect(() => {
		form.reset({ content: content });
	}, [content]);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
		}
	}, [isEditing]);

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (e.key === "Escape" || e.key === 27) {
				setIsEditing(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const fileType = fileUrl?.split(".").pop();

	const isAdmin = member.role === MemberRole.ADMIN;
	const isModerator = member.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;
	const canDeleteMessage = !deleted && (isModerator || isAdmin || isOwner);
	const canEdit = !deleted && isOwner;
	const isPdf = fileUrl && fileType === "pdf";
	const isImage = fileUrl && !isPdf;

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: socketUrl + "/" + id,
				query: socketQuery,
			});
			await axios.patch(url, values);
			form.reset();
			setIsEditing(false);
		} catch (error) {
			console.log("error in editing message", error)
		}
	};
	
	return (
		<div className="flex items-center w-full bg-white dark:bg-black/5 transition group p-4 relative">
			<div className="flex items-start gap-x-2 group w-full ">
				<div onClick={onMemberClick} className="cursor-pointer drop-shadow-md transition">
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p className="text-sm hover:underline font-semibold cursor-pointer">
								{member.profile.name}
							</p>
							<ActionTooltip className="text-xs" label={member.role}>
								{iconRoleMap[member.role]}
							</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">
							{timestamp}
						</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noreferrer noopener"
							className="relative flex items-center p-2 mt-2 rounded-md bg-background/20 hover:bg-background/30 overflow-hidden"
						>
							<Image
								src={fileUrl}
								height={200}
								width={200}
								alt={content}
								className="object-cover rounded-md"
							/>
						</a>
					)}
					{isPdf && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noreferrer noopener"
							className="flex items-center p-2 mt-2 rounded-md bg-background/20 hover:bg-background/30 relative"
						>
							<FileIcon className="h-10 w-10 stroke-indigo-500 fill-indigo-300 " />
							<span className="ml-2 text-sm text-indigo-500 dark:text-indigo-600">
								PDF File
							</span>
						</a>
					)}
					{!fileUrl && !isEditing && (
						<div
							className={cn(
								"text-sm relative  text-zinc-600 dark:text-zinc-300 flex gap-x-4 bg-background/20 hover:bg-background/30 p-2 mt-1",
								deleted && "italic mt-1 text-zinc-500 dark:text-zinc-400"
							)}
						>
							<p className="break-all">{content}</p>
							{isUpdated && !deleted && (
								<div className="shrink-0">
									<ActionTooltip className="text-xs" label="Edited">
										<MessageCircleWarningIcon className="h-4 w-4 text-indigo-500" />
									</ActionTooltip>
								</div>
							)}
							{canDeleteMessage && (
								<div className="hidden group-hover:flex items-center p-0.5 absolute -top-[25px] right-0 gap-x-2 bg-white dark:bg-zinc-800 rounded-sm border ">
									{canEdit && (
										<ActionTooltip className="text-xs" label="Edit">
											<Edit
												onClick={() => {
													setIsEditing(true);
												}}
												className="text-zinc-500 hover:text-zinc-600 dark:text-400 dark:hover:text-zinc-300 h-4 w-4 cursor-pointer transition"
											/>
										</ActionTooltip>
									)}
									{canDeleteMessage && (
										<ActionTooltip className="text-xs" label="Delete">
											<Trash
												onClick={() =>
													onOpen("deleteMessage", {
														apiUrl: `${socketUrl}/${id}`,
														query: socketQuery,
													})
												}
												className="text-zinc-500 hover:text-zinc-600 dark:text-400 dark:hover:text-zinc-300 h-4 w-4 cursor-pointer transition"
											/>
										</ActionTooltip>
									)}
								</div>
							)}
						</div>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								autoComplete="off"
								className=" gap-1 flex flex-col w-full"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field: { ref, ...fields } }) => {
										return (
											<FormItem className="flex-1">
												<FormControl>
													<div className="relative w-full">
														<Input
															disabled={isLoading}
															ref={inputRef}
															className="bg-zinc-200/90 break-all  text-wrap p-1 dark:bg-zinc-700/20 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
															placeholder="Edited Message"
															{...fields}
														/>
													</div>
												</FormControl>
											</FormItem>
										);
									}}
								/>
								<div className="flex items-center gap-2">
									<Button
										disabled={isLoading}
										size="sm"
										variant="primary"
										className="self-start px-2 py-1 h-auto"
									>
										Save
									</Button>
									<span className="text-zinc-400 text-[11px]">
										Press Esc to cancel and Enter to Save
									</span>
								</div>
							</form>
						</Form>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatItem;
