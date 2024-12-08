'use client';
import { useState, KeyboardEvent, useEffect } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', content: string }>>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tools, setTools] = useState([]);

    // Fetch tools khi component mount
    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('/api/showai');
                const data = await response.json();
                setTools(data.data);
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        };
        fetchTools();
    }, []);

    const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            setIsLoading(true);
            setMessages(prev => [...prev, { type: 'user', content: input }]);

            try {
                const response = await fetch('/api/aiChat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: input,
                        tools: tools // Truyền tools vào request
                    })
                });

                const data = await response.json();
                setMessages(prev => [...prev, { type: 'ai', content: data.reply }]);
            } catch (error) {
                console.error('Chat error:', error);
                setMessages(prev => [...prev, {
                    type: 'ai',
                    content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
                }]);
            }

            setInput('');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 bg-black text-white flex items-center justify-center p-4">
            <div className="w-full h-[calc(100vh-5rem)] max-w-7xl border-2 border-white rounded-lg pt-1 px-2 text-xl">
                <div className="font-mono bg-black text-white h-full overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col mb-2">
                            <div className="flex items-start">
                                <span className="text-white whitespace-nowrap">
                                    {msg.type === 'user' ? 'nguoi-dung> ' : 'ai> '}
                                </span>
                                <span className="break-words">{msg.content.split('\n')[0]}</span>
                            </div>
                            {msg.content.split('\n').slice(1).map((line, i) => (
                                <div key={i} className="break-words">
                                    {line}
                                </div>
                            ))}
                        </div>
                    ))}
                    {!isLoading && (
                        <div className="flex">
                            <span className="text-white">nguoi-dung&gt; </span>
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none flex-1 caret-white"
                                autoFocus
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
