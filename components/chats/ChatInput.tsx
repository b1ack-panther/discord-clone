"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../EmojiPicker";

interface ChatInputProps {
	name: string;
	apiUrl: string;
	type: "channel" | "conversation";
	query: Record<string, any>;
}

const formSchema = z.object({
	content: z.string().min(1),
});

const ChatInput = ({ name, apiUrl, type, query }: ChatInputProps) => {
	const { onOpen } = useModal();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl,
				query,
			});
			await axios.post(url, values);
			form.reset();
		} catch (error) {
			console.log("error sending message:", error);
		}
	};

	return (
		<Form {...form}>
			<form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									<button
										type="button"
										onClick={() => onOpen("messageFile", { apiUrl, query })}
										className="absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input

										{...field}
										placeholder={`Message ${
											type === "conversation" ? name : "#" + name
										}`}
										disabled={isLoading}
										className="px-14 w-full py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-0 focus-visible:ring-0  focus-visible:ring-offset-0"
									/>
									<div className="top-7 right-8 absolute">
										<EmojiPicker
											onChange={(emoji: string) => {
												field.onChange(field.value + emoji);
											}}
										/>
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ChatInput;
