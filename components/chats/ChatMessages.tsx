"use client";

import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { UseChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef } from "react";
import { MessageWithMemberWithProfile } from "@/types";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import UseChatSocket from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyy, HH:mm";

const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}: ChatMessagesProps) => {
	const chatRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage, status } =
		UseChatQuery({
			apiUrl,
			paramKey,
			paramValue,
			queryKey,
		});

	UseChatSocket({ queryKey, addKey, updateKey });
	useChatScroll({
		bottomRef,
		chatRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
	});

	if (status === "loading") {
		return (
			<div className=" flex flex-1 flex-col justify-center items-center">
				<Loader2 className="animate-spin my-4 text-zinc-500 h-7 w-7" />
				<p className="text-sm text-zinc-500 dark:text-zinc-400">
					Loading Messages...
				</p>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className=" flex flex-1 flex-col items-center justify-center ">
				<ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
				<p className=" text-sm text-zinc-500 dark:text-zinc-400">
					Something went wrong!
				</p>
			</div>
		);
	}

	return (
		<div ref={chatRef} className="flex-1 flex flex-col overflow-y-auto py-4">
			{!hasNextPage && <div className="flex-1" />}

			{!hasNextPage && <ChatWelcome name={name} type={type} />}
			{hasNextPage && (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="w-7 h-7 animate-spin my-4 mx-auto" />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition my-3 text-xs p-1"
						>
							Load Previous Messages
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group?.items?.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								id={message.id}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.delete}
								currentMember={member}
								member={message.member}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
								isUpdated={message.createdAt !== message.updatedAt}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};

export default ChatMessages;
