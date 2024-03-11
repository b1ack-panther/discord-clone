import { Hash } from "lucide-react";
import MobileToggle from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import SocketIndicator from "../SocketIndicator";
import ChatVideoButton from "./ChatVideoButton";

interface ChatHeaderProps {
	serverId: string;
	imageUrl?: string;
	name: string;
	type: "channel" | "conversation";
}

const ChatHeader = ({ serverId, imageUrl, name, type }: ChatHeaderProps) => {
	return (
		<div className="text-md font-semibold h-12 px-3 shadow-lg z-10 border-neutral-200 dark:border-neutral-800 flex flex-shrink-0 items-center">
			<MobileToggle serverId={serverId} />
			{type === "channel" && (
				<Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-500 ml-2" />
			)}
			{type === "conversation" && (
				<UserAvatar className="h-7 w-7 mr-2" src={imageUrl} />
			)}
			<span className="text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
				{" "}
				{name}
			</span>
			<div className="ml-auto flex items-center">
				{type === "conversation" && <ChatVideoButton />}
				<SocketIndicator />
			</div>
		</div>
	);
};

export default ChatHeader;
