import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I am the OneStop AI Mentor, powered by Ollama. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem('onestop_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            const res = await fetch(`${apiUrl}/chat/message`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await res.json();
            
            if (data.success && data.reply) {
                setMessages(prev => [...prev, {
                    text: data.reply.content || "Sorry, I couldn't process that.",
                    isBot: true
                }]);
            } else {
                throw new Error(data.message || "Invalid response format");
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = error.message.includes("Not authorized") || error.message.includes("token")
                ? "Please log in or create an account to use the AI Mentor."
                : "My neural connection is currently disrupted. Please ensure the backend and Ollama are running.";
            
            setMessages(prev => [...prev, {
                text: errorMessage,
                isBot: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-[#0F172A] rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] w-80 h-96 flex flex-col border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center z-10 shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white/30">
                                AI
                            </div>
                            <div>
                                <span className="font-semibold block leading-tight">OneStop Mentor</span>
                                <span className="text-[10px] text-indigo-200">powered by qwen2.5</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#0F172A] relative scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                        
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex relative z-10 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.isBot
                                        ? 'bg-white/5 text-white border border-white/10 rounded-tl-sm'
                                        : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/20'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start relative z-10">
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                                    <span className="text-xs text-indigo-200">Analyzing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0F172A] flex gap-2 relative z-10">
                        <input
                            type="text"
                            placeholder="Ask coding/career doubts..."
                            className="flex-grow px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-indigo-300/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-colors"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform flex items-center justify-center border border-white/20"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default ChatbotWidget;
