'use client'

import { Conversation } from "@/app/types/interfaces"
import ConversationBadge from "./ConversationBadge";

interface SidebarProps{
    Conversations: Conversation[];
    onSelect: (value: string) => void;
}


export default function Sidebar({Conversations, onSelect}: SidebarProps){
    return (
        <aside className="hidden  lg:flex lg:flex-col p-8  gap-y-8 w-1/6 bg-[#F8F8F8] text-black">
            <input></input>
            Aca van los friends!
            {Conversations && Conversations.map((conversation) => <ConversationBadge onSelect={onSelect} key={String(conversation.id)} id={String(conversation.id)}/>)}

        </aside>
    )
}