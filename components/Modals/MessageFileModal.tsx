"use client";

import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormLabel,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import FileUpload from "../file-upload";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
	fileUrl: z.string().min(1, {
		message: "Attachment is required",
	}),
});

const MessageFileModal = () => {
	const { isOpen, onClose, data, type } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "messageFile";

	const { apiUrl, query } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { fileUrl: "" },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			});
			await axios.post(url, {
				...values,
				content: values.fileUrl,
			});

			form.reset();
			router.refresh();
			handleClose();
		} catch (error) {
			console.log("error in creating server:. ", error);
		}
	};

	const isLoading = form.formState.isSubmitting;

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Send an Attachment
					</DialogTitle>

					<DialogDescription className="text-zinc-500 text-center">
						Send a file as a message
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									name="fileUrl"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="px-6 py-4 bg-gray-100">
							<Button variant="primary" disabled={isLoading}>
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default MessageFileModal;
