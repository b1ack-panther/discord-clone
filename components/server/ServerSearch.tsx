"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
	data:
		| {
				type: "member" | "channel";
				label: string;
				data:
					| {
							icon: React.ReactNode;
							name: string;
							id: string;
					  }[]
					| undefined;
		  }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const params  = useParams();

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", keyDown);
		return () => document.removeEventListener("keydown", keyDown);
	}, []);

	const onClick = ({
		id,
		type,
	}: {
		id: string;
		type: "member" | "channel";
	}) => {
		setOpen(false);
		if (type === "member") {
			router.push(`/servers/${params?.serverId}/conversations/${id}`);
		}
		if (type === "channel") {
			router.push(`/servers/${params?.serverId}/channels/${id}`);
		}
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="group p-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 flex items-center rounded-md w-full gap-x-2 transition"
			>
				<Search className="text-zinc-500 dark:text-zinc-400 font-semibold w-4 h-4" />
				<span className="font-semibold text-sm group-hover:text-zinc-600 text-zinc-500 dark:group-hover:text-zinc-500 dark:text-zinc-400 transition">
					Search
				</span>
				<kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
					<span className="text-xs">CTRL</span>K
				</kbd>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Searc all Channels and Members" />
				<CommandList>
					<CommandEmpty>No Results Found</CommandEmpty>
					{data.map(({ label, type, data }) => (
						<CommandGroup key={label} heading={label}>
							{data?.map(({ icon, id, name }) => (
								<CommandItem onSelect={() => onClick({ id, type })} key={id}>
									{icon}
									<span>{name}</span>
								</CommandItem>
							))}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default ServerSearch;
