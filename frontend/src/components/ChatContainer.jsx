import React from 'react'
import { useChatStore } from '../stores/chatStore'
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuthStore } from '../stores/authStore';
import { useRef } from 'react';

const formatDate = (date) => {
    const options = {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  
    return new Date(date).toLocaleString("en-US", options);
  };


const ChatContainer = () => {
    const {messages, isMessagesLoading, getMessages, selectedUser, 
        subscribeMessages, unsubscribeMessages} = useChatStore();

    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

    //for realtime functionality
    //when selecteduser changes, change messages to new user
    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeMessages();
        return () => unsubscribeMessages();
        
    }, [selectedUser._id, getMessages, subscribeMessages, unsubscribeMessages]);

    useEffect(() =>{
        if(messageEndRef.current && messages)  messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }, [messages])


    if(isMessagesLoading) return <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader/>
        <MessageInput />
    </div>

    

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message)=> (
                    <div
                    key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end": "chat-start" }`}
                    ref={messageEndRef}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img 
                                src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                                alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className='chat-header mb-3'>
                            <time className='text-xs opacity-60 ml-2'>
                                {formatDate(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                src={message.image}
                                alt="Attachment"
                                className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                         </div>


                    </div>

                ))}


            </div>

            <MessageInput />
        </div>
    )
}

export default ChatContainer