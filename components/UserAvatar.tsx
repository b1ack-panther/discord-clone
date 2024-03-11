import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
	src?: string;
	className?: string;
}
const UserAvatar = ({ src, className }: UserAvatarProps) => {
	return (
		<div className="shrink-0">
			<img
				src={src}
				className={cn("h-7 w-7 rounded-full object-cover", className)}
			/>
		</div>
	);
};

export default UserAvatar;
