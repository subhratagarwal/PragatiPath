import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '@google/genai';
import { startChatSession, sendMessageToChat } from '../services/geminiService';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from './icons';

interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
    const MotionDiv = motion.div;
    const MotionButton = motion.button;

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { sender: 'ai', text: "Hello! I'm PragatiPath AI. How can I help you today? You can ask me how to report an issue or check the status of a report with its ID (e.g., 'status for i1')." }
            ]);
        }
    }, [isOpen]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: trimmedInput }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            let session = chatSession;
            if (!session) {
                session = await startChatSession();
                setChatSession(session);
            }
            const aiResponse = await sendMessageToChat(session, trimmedInput);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 h-[60vh] max-h-[700px] bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col z-50 border border-gray-700"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <SparklesIcon className="w-6 h-6 mr-2 text-cyan-400" />
                                PragatiPath AI Assistant
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </header>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <MotionDiv
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">A</div>}
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                        <p className="text-sm break-words">{msg.text}</p>
                                    </div>
                                </MotionDiv>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">A</div>
                                    <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-700 text-gray-200 rounded-bl-none">
                                        <div className="flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                            <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full bg-gray-900 rounded-full py-2 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <button type="submit" disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white transition-colors">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <MotionButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 sm:right-8 bg-cyan-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50"
                aria-label="Open AI Chat Assistant"
            >
                 <AnimatePresence mode="popLayout">
                    <MotionDiv
                        key={isOpen ? 'close' : 'open'}
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? <XMarkIcon className="w-8 h-8"/> : <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />}
                    </MotionDiv>
                </AnimatePresence>
            </MotionButton>
        </>
    );
};

export default ChatAssistant;