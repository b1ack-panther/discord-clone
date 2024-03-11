"use client"

import React from "react";
import { useSocket } from "./providers/SocketProvider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
	const { isConnected } = useSocket();

	if (!isConnected) {
		return (
			<Badge
				variant="outline"
				className="border-none bg-yellow-600 text-white "
			>
				Fallback: Polling every 1s
			</Badge>
		);
	}

	return (
		<Badge variant="outline" className="border-none bg-emerald-600 text-white">
			Live: Real-time Updates
		</Badge>
	);
};

export default SocketIndicator;
