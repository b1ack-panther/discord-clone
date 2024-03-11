"use client";

import {
	Dialog,
	DialogContent,
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
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useEffect } from "react";

const formSchema = z.object({
	channelName: z
		.string()
		.min(1, {
			message: "Channel name is required",
		})
		.refine((name) => name != "general", {
			message: "Channel name can not be 'general'",
		}),
	type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();
	const params = useParams();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { channelName: "", type: data.channelType || ChannelType.TEXT  },
	});

	const isModalOpen = isOpen && type === "createChannel";

	useEffect(() => {
		if (data.channelType) {
			form.setValue("type", data.channelType );
		}
		else {
			form.setValue("type", ChannelType.TEXT)
		}
	}, [data.channelType, form]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url =
				"/api/channels?" + new URLSearchParams({ serverId: params?.serverId as string });
			await axios.post(url, values);
			

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log("error in creating channel: ", error);
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
						Create Channel
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								name="channelName"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												{...field}
												placeholder="Enter Channel name"
												className="active:text-black focus-within:text-black  bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="type"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="border-gray-500/50  focus:ring-0 capitalize focus:ring-offset-0 ring-offset-0 bg-zinc-300/50 text-black">
													<SelectValue placeholder="Select Channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map((type) => (
													<SelectItem
														key={type}
														value={type}
														className="capitalize"
													>
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="px-6 py-4 bg-gray-100">
							<Button variant="primary" disabled={isLoading}>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateChannelModal;
