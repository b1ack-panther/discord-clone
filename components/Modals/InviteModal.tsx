"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import ActionTooltip from "../ActionTooltip";
import axios from "axios";

const InviteModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const origin = useOrigin();

	const isModalOpen = isOpen && type === "invite";
	const { server } = data;

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const generateNew = async () => {
		try {
			setIsLoading(true);
			const url = `/api/servers/${server?.id}/invite-code`;
			
			const response = await axios.patch(
				url
			);

			onOpen("invite", {server: response.data});
		} catch (error) {
			console.log("error generating new invite code: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Invite Friends
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="font-semibold text-xs text-zinc-500 dark:text-secondary/70">
						Server Invite Link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							className="bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-black border-0"
							value={inviteUrl}
							readOnly
							disabled={isLoading}
						/>
						<ActionTooltip
							side="top"
							align="center"
							label={copied ? "copied" : "copy"}
						>
							<Button
								onClick={onCopy}
								disabled={isLoading}
								className="bg-zinc-300/50"
								size="icon"
							>
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</ActionTooltip>
					</div>
					<Button
						disabled={isLoading}
						onClick={generateNew}
						variant="primary"
						className="mt-4"
					>
						Generate New Link
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InviteModal;
