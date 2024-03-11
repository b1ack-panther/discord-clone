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
import { useRouter } from "next/navigation";

const formSchema = z.object({
	serverName: z.string().min(1, {
		message: "Server name is required",
	}),
	imageUrl: z.string().min(1, {
		message: "Image is required",
	}),
});

const InitialModal = () => {
	const [isMounting, setIsMounting] = useState(false);
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { serverName: "", imageUrl: "" },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const res = await axios.post("/api/servers", values);
			
			form.reset();
			router.refresh();
			window.location.reload();
		} catch (error) {
			console.log("error in creating server:. ", error);
		}
	};

	const isLoading = form.formState.isSubmitting;

	useEffect(() => {
		setIsMounting(true);
	}, []);

	if (!isMounting) return null;

	return (
		<Dialog open>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						Customize Your Server
					</DialogTitle>

					<DialogDescription className="text-zinc-500 text-center">
						Give Your server a personaliy with a name and image. You can always
						change it later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									name="imageUrl"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								name="serverName"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Server name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												{...field}
												placeholder="Enter Server name"
												className="active:text-black focus-within:text-black  bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
											/>
										</FormControl>
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

export default InitialModal;
