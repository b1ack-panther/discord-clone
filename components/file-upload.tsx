"use client";

import { UploadDropzone } from "@/lib/uploadThing";
import { File, X } from "lucide-react";
import Image from "next/image";

type FileUploadProps = {
	onChange: (url?: string) => void;
	value: string;
	endpoint: "serverImage" | "messageFile";
};

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
	const fileType = value.split(".").pop();
	if (fileType && fileType !== "pdf") {
		return (
			<div className="relative h-20 w-20">
				<Image
					src={value}
					className="rounded-full w-full h-full object-cover"
					alt="upload"
					sizes="100%"
					fill
					objectFit="cover"
				/>
				<button
					className="absolute top-0 right-0 text-white p-1 bg-rose-500 rounded-full shadow-sm"
					onClick={() => onChange("")}
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	if (fileType && fileType === "pdf") {
		return (
			<div className="flex items-center p-2 mt-2 rounded-md bg-background/10 relative">
				<File className="h-10 w-10 stroke-indigo-500 fill-indigo-300 " />
				<a
					href={value}
					target="_blank"
					rel="noreferrer noopener"
					className="ml-2 text-sm text-indigo-500 dark:text-indigo-600"
				>
					{value}
				</a>

				<button
					className="absolute -top-2 -right-2 text-white p-1 bg-rose-500 rounded-full shadow-sm"
					onClick={() => onChange("")}
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	return (
		<div>
			<UploadDropzone
				className="ut-label:text-indigo-600 ut-button:bg-indigo-500 ut-button:ut-readying:bg-indigo-500/40 ut-button:ut-uploading:bg-indigo-500/30 after:ut-button:ut-uploading:bg-indigo-500 bg-gray-100"
				endpoint={endpoint}
				onClientUploadComplete={(res) => {
					onChange(res?.[0].url);
				}}
				onUploadError={(error: Error) => {
					console.log(error);
				}}
			/>
		</div>
	);
};

export default FileUpload;
