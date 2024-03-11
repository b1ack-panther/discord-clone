"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

const LeaveServerModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "leaveServer";
	const { server } = data;

	const handleLeave = async () => {
		try {
			setIsLoading(true);
			await axios.patch(`/api/servers/${server?.id}/leave`);

			router.refresh();
			onClose();
			redirect("/");
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Leave Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure, you want to leave server{" "}
						<span className="font-semibold text-black">{server?.name}</span>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4 bg-gray-100">
					<div className="w-full flex items-center justify-between">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							onClick={handleLeave}
							variant="primary"
						>
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LeaveServerModal;
