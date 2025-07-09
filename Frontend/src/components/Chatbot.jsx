import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const API_URL = 'http://localhost:5000/api/chatbot/advice';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        console.log('Sending request to:', API_URL);
        console.log('Request payload:', {
            message: userMessage,
            chatHistory: messages
        });

        try {
            const response = await axios.post(API_URL, {
                message: userMessage,
                chatHistory: messages
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response received:', response.data);

            if (response.data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.data.message,
                    timestamp: response.data.data.timestamp
                }]);
            } else {
                throw new Error(response.data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error getting advice:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Financial Advisor Chatbot</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.role} ${message.isError ? 'error' : ''}`}
                    >
                        <div className="message-content">{message.content}</div>
                        {message.timestamp && (
                            <div className="message-timestamp">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="message-content">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot; 