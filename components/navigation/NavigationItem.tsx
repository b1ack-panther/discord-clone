"use client";

import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ActionTooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemProps {
	id: string;
	imageUrl: string;
	name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();

	const onClick = () => {
		router.push(`/servers/${id}`);
	};
	return (
		<ActionTooltip align="center" side="right" label={name}>
			<button onClick={onClick} className="group flex items-center relative">
				<div
					className={cn(
						"absolute bg-primary w-[4px] rounded-full left-0 transition-all duration-300",
						params.serverId === id ? "h-[36px]" : "h-0 group-hover:h-[20px]"
					)}
				/>
				<div
					className={cn(
						"relative group flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] rounded-[24px] transition-all overflow-hidden",
						params.serverId === id &&
							"rounded-[16px] bg-primary/10 text-primary"
					)}
				>
					<Image
						src={imageUrl}
						alt="serverImg"
						fill
						sizes="100%"
						className="w-full h-full object-cover"
					/>
				</div>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItem;
