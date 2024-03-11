import { Channel, Member, Message, Profile, Server } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type ServerWithMembersWithProfile = Server & {
	members: (Member & { profile: Profile })[];
	channels: Channel[];
};

export type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};

export type MessageWithMemberWithProfile = Message & {
	member: (Member & {
		profile: Profile
	})
}