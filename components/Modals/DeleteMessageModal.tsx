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

const DeleteMessageModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onClose, type, data } = useModal();

	const isModalOpen = isOpen && type === "deleteMessage";
	const { apiUrl, query } = data;

	const handleDelete = async () => {
		try {
			setIsLoading(true);

			const url = apiUrl + "?" + new URLSearchParams({ ...query });

			await axios.delete(url);

			onClose();
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
						Delete Message
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure, you want to do this ? <br />
						This message will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4 bg-gray-100">
					<div className="w-full flex items-center justify-between">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							onClick={handleDelete}
							variant="delete"
						>
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteMessageModal;
