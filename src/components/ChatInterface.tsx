import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Message } from '../types';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

interface ChatInterfaceProps {
  onDataUpdate: (data: any) => void;
}

export function ChatInterface({ onDataUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an environmental analysis expert. Analyze and provide detailed insights about environmental factors.
            
            ALWAYS include a JSON response at the end of your message in the following format:
            {
              "sunPath": {
                "azimuth": <number>,
                "elevation": <number>,
                "exposure": <number>
              },
              "wind": {
                "direction": "<string>",
                "speed": <number>
              },
              "soil": {
                "bdod": <number>,
                "soc": <number>,
                "clay": <number>,
                "nitrogen": <number>,
                "depth": <number>
              },
              "elevation": {
                "height": <number>,
                "slope": <number>
              },
              "disturbances": [
                {
                  "type": "<string>",
                  "severity": <number>
                }
              ],
              "climate": {
                "temperature": <number>,
                "humidity": <number>,
                "precipitation": <number>
              }
            }
            Replace <number> with actual numerical values and <string> with appropriate text.
            This JSON MUST be included at the end of EVERY response.`
          },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const assistantMessage = {
        role: 'assistant' as const,
        content: completion.choices[0]?.message?.content || 'No response'
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      try {
        const jsonMatch = assistantMessage.content.match(/\{(?:[^{}]|{[^{}]*})*\}/g);
        if (jsonMatch) {
          const lastJson = jsonMatch[jsonMatch.length - 1];
          const data = JSON.parse(lastJson);
          
          if (data.sunPath && data.wind && data.elevation) {
            onDataUpdate(data);
          } else {
            console.warn('Incomplete environmental data in response');
          }
        }
      } catch (e) {
        console.error('Failed to parse visualization data:', e);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 transition-all duration-300 ${
                message.role === 'user'
                  ? 'bg-blue-500/80 text-white hover:bg-blue-500'
                  : 'bg-gray-800/80 text-gray-200 hover:bg-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/80 rounded-lg p-3 animate-pulse text-gray-300">
              Analyzing...
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-800 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Try: Analyze environmental factors at latitude 40.7128, longitude -74.0060"
            className="flex-1 bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}