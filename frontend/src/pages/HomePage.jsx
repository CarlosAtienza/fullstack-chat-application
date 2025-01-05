import Sidebar from "../components/Sidebar";
import { useChatStore } from "../stores/chatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";


const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (
    <div className="h-6 bg-base-100">
      <div className="flex items-center justify-center pt-24 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;