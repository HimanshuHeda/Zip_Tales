import { useState } from "react";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4">
          <div className="h-60 overflow-y-auto mb-2 border-b dark:border-gray-700">
            {messages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Start a conversation...
              </p>
            ) : (
              messages.map((msg, i) => (
                <p key={i} className="text-sm text-gray-900 dark:text-gray-100">
                  {msg}
                </p>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
