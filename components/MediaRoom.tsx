"use client";

import { useUser } from "@clerk/nextjs";
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	VideoConference,
	useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Track } from "livekit-client";

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

export default function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
	const { user } = useUser();
	const [token, setToken] = useState("");

	useEffect(() => {
		if (!user?.firstName || !user?.lastName) return;
		const name = `${user.firstName} ${user.lastName}`;

		(async () => {
			try {
				const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
				const data = await res.json();
				setToken(data.token);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [user?.firstName, user?.lastName, chatId]);

	if (token === "") {
		return (
			<div className="flex flex-col items-center flex-1  justify-center">
				<Loader2 className="w-7 h-7 animate-spin text-zinc-500 my-4" />
				<p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<div className="h-[84%] w-full ">
			{/* <LiveKitRoom
				token={token}
				audio={audio}
				video={false}
				serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
				connect={true}
				data-lk-theme="default"
			>
				<VideoConference />
				<RoomAudioRenderer />
			</LiveKitRoom> */}

			<LiveKitRoom
				video={video}
				audio={audio}
				token={token}
				serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
				connect
				data-lk-theme="default"
			>
				{/* Your custom component with basic video conferencing functionality. */}
				<MyVideoConference />
				{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
				<RoomAudioRenderer />
				{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
				<ControlBar controls={{ camera: video }} />
			</LiveKitRoom>
		</div>
	);
}

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false }
	);
	return (
		<GridLayout tracks={tracks}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}
