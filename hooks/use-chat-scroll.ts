// import { useEffect, useState } from "react";

// interface UseChatScrollProps {
// 	chatRef: React.RefObject<HTMLDivElement>;
// 	bottomRef: React.RefObject<HTMLDivElement>;
// 	count: number;
// 	loadMore: () => void;
// 	shouldLoadMore: boolean;
// }

// export default function useChatScroll({
// 	chatRef,
// 	bottomRef,
// 	count,
// 	loadMore,
// 	shouldLoadMore,
// }: UseChatScrollProps) {
// 	const [hasInitialized, setHasInitialized] = useState(false);

// 	const chatDiv = chatRef.current;
// 	const bottomDiv = bottomRef.current;

// 	useEffect(() => {
// 		const handleScroll = () => {
// 			if (chatDiv?.scrollTop === 0 && shouldLoadMore) {
// 				loadMore();
// 			}
// 		};
// 		chatDiv?.addEventListener("scroll", handleScroll);
// 		return () => chatDiv?.removeEventListener("scroll", handleScroll);
// 	}, [chatRef, shouldLoadMore, loadMore]);

// 	useEffect(() => {
// 		const shouldAutoScroll = () => {
// 			if (!hasInitialized && bottomDiv) {
// 				setHasInitialized(true);
// 				return true;
// 			}
// 			if (!chatDiv) return false;

// 			const distanceFromBottom =
// 				chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight;
// 			return distanceFromBottom <= 100;
// 		};
// 		if (shouldAutoScroll()) {
// 			setTimeout(() => {
// 				bottomDiv?.scrollIntoView({
// 					behavior: "smooth",
// 				});
// 			}, 100);
// 		}
// 	}, [bottomRef, chatRef, hasInitialized, count]);
// }

import { useEffect, useState } from "react";

type ChatScrollProps = {
	chatRef: React.RefObject<HTMLDivElement>;
	bottomRef: React.RefObject<HTMLDivElement>;
	shouldLoadMore: boolean;
	loadMore: () => void;
	count: number;
};

export const useChatScroll = ({
	chatRef,
	bottomRef,
	shouldLoadMore,
	loadMore,
	count,
}: ChatScrollProps) => {
	const [hasInitialized, setHasInitialized] = useState(false);

	useEffect(() => {
		const topDiv = chatRef?.current;

		const handleScroll = () => {
			const scrollTop = topDiv?.scrollTop;

			if (scrollTop === 0 && shouldLoadMore) {
				loadMore();
			}
		};

		topDiv?.addEventListener("scroll", handleScroll);

		return () => {
			topDiv?.removeEventListener("scroll", handleScroll);
		};
	}, [shouldLoadMore, loadMore, chatRef]);

	useEffect(() => {
		const bottomDiv = bottomRef?.current;
		const topDiv = chatRef.current;
		const shouldAutoScroll = () => {
			if (!hasInitialized && bottomDiv) {
				setHasInitialized(true);
				return true;
			}

			if (!topDiv) {
				return false;
			}

			const distanceFromBottom =
				topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
			return distanceFromBottom <= 100;
		};

		if (shouldAutoScroll()) {
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}, 100);
		}
	}, [bottomRef, chatRef, count, hasInitialized]);
};