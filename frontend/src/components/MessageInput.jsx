import { useRef, useState } from 'react'
import { useChatStore } from '../stores/chatStore';
import { Image, Send } from 'lucide-react';
import { X } from 'lucide-react';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const {sendMessage} = useChatStore();

 
    // Check if file is an image and set it to preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")){
            toast.error("Select an Image File");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";



    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });
             // Clear form
                setText("");
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message: ", error.message)
        }

    };


    return (
        <div className='p-4 w-full'>
             {imagePreview && (
            <div className="mb-3 flex justify-end items-center gap-2">
            <div className="relative mr-24">
                <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
                <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                flex items-center justify-center"
                type="button"
                >
                    <X className="size-3" />
                    </button>
                </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
                <div className='flex-1 flex gap-3'>
                    {/* Text Input */}
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {/* */}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    <button
                        type="button"
                        aria-label="Upload an Image"
                        className={`hidden sm:flex btn btn-circle
                                ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                </button>

                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}
                    >
                    <Send size={22} />
                    </button>

            </form>




        </div>
    )
}

export default MessageInput