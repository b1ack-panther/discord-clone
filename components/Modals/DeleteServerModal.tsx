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

const DeleteServerModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "deleteServer";
	const { server } = data;

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/servers/${server?.id}`)

			router.refresh();
			onClose();
			redirect("/")
		}
		catch (error) {
			console.log(error);
		}
		finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Delete Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure, you want to do this ? <br />
						<span className="font-semibold text-black">{server?.name}</span> Will be deleted permanently.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4 bg-gray-100">
					<div className="w-full flex items-center justify-between">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button disabled={isLoading} onClick={handleDelete} variant="delete">
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteServerModal;
