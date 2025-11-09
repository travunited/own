'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Paperclip,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialize = async () => {
      const resolvedParams = await params;
      setTicketId(resolvedParams.id);
      loadTicket(resolvedParams.id);
    };
    initialize();
  }, []);

  const loadTicket = async (id: string) => {
    try {
      // TODO: Create GET /api/support/tickets/[id] endpoint
      setLoading(false);
    } catch (error) {
      console.error('Error loading ticket:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // TODO: Create POST /api/support/tickets/[id]/messages endpoint
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      open: { icon: AlertCircle, color: 'blue', label: 'Open' },
      in_progress: { icon: Clock, color: 'yellow', label: 'In Progress' },
      resolved: { icon: CheckCircle, color: 'green', label: 'Resolved' },
      closed: { icon: CheckCircle, color: 'gray', label: 'Closed' },
    };
    return configs[status] || configs.open;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => router.push('/support')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tickets
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/80 mb-1">
                    Ticket #TKT-XXXXXX
                  </p>
                  <h1 className="text-2xl font-bold">Support Ticket</h1>
                </div>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  Open
                </span>
              </div>
              <p className="text-white/90">
                Created on {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Messages */}
            <div className="p-6 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
              {/* Initial Ticket Message */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">You</p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      This is the ticket description. Support messages will appear here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Admin Response */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">Support Team</p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      Thank you for contacting us. We'll assist you shortly.
                    </p>
                  </div>
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="btn-primary px-6 flex items-center disabled:opacity-50"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

