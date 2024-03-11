import { ServerWithMembersWithProfile } from "@/types";
import { Channel, ChannelType } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
	| "createServer"
	| "invite"
	| "editServer"
	| "members"
	| "createChannel"
	| "leaveServer"
	| "deleteServer"
	| "deleteChannel"
	| "editChannel"
	| "messageFile"
	| "deleteMessage";

interface ModalData {
	server?: ServerWithMembersWithProfile;
	channel?: Channel;
	channelType?: ChannelType;
	apiUrl?: string;
	query?: Record<string, any>;
}

interface ModalStore {
	data: ModalData;
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	data: {},
	type: null,
	isOpen: false,
	onOpen: (type: ModalType, data = {}) => set({ type, data, isOpen: true }),
	onClose: () => set({ type: null, isOpen: false }),
}));
