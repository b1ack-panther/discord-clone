"use client";

import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import ActionTooltip from "../ActionTooltip";

const ChatVideoButton = () => {
	const searchParams = useSearchParams();
	const path = usePathname();
	const router = useRouter();

	const isVideo = searchParams?.get("video");

	const Icon = !isVideo ? Video : VideoOff;
  const videoTooltip = isVideo ? "End VideoCall" : "Start VideoCall";
  
  const onClick = () => {
    const url = qs.stringifyUrl({
      url: path ?? "",
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true })
    
    router.push(url);
  }

	return (
		<ActionTooltip label={videoTooltip} side="bottom">
      <button onClick={onClick} className="mr-4 hover:opacity-75 transition">
				<Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
			</button>
		</ActionTooltip>
	);
};

export default ChatVideoButton;
