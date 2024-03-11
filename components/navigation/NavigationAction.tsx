"use client"
import { Plus } from "lucide-react"
import ActionTooltip from "../ActionTooltip"
import { useModal } from "@/hooks/use-modal-store"

export const NavigationAction = () => {
	const onOpen = useModal(state => state.onOpen);

  return (
		<div>
			<ActionTooltip align="center" side="right" label="Add server">
				<button onClick={()=>onOpen("createServer")}  className="group flex items-center">
					<div className="flex items-center mx-3 w-[48px] h-[48px] rounded-[24px] transition-all overflow-hidden group-hover:rounded-[16px] justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						<Plus
							className="text-emerald-500 group-hover:text-white transition"
							size={25}
						/>
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
}

