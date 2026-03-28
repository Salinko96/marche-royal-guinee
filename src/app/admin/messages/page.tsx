'use client';

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: !currentStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-base px-3 py-2">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Card
              key={message.id}
              className={`border-0 shadow-md overflow-hidden transition-all ${
                !message.isRead ? 'ring-2 ring-amber-300 bg-amber-50' : ''
              }`}
            >
              {/* Message Header */}
              <div
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === message.id ? null : message.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {!message.isRead ? (
                        <Mail size={24} className="text-amber-500" />
                      ) : (
                        <MailOpen size={24} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        {!message.isRead && (
                          <Badge className="bg-amber-500 text-white">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button className="ml-4 p-2">
                    {expandedId === message.id ? (
                      <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === message.id && (
                <div className="p-6 bg-gray-50 space-y-6">
                  {/* Message Content */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                      Message
                    </h4>
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 uppercase mb-2">Email</p>
                      <a
                        href={`mailto:${message.email}`}
                        className="font-medium text-amber-600 hover:text-amber-700"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 uppercase mb-2">Téléphone</p>
                      <a
                        href={`tel:${message.phone}`}
                        className="font-medium text-amber-600 hover:text-amber-700"
                      >
                        {message.phone}
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
                    <Button
                      onClick={() =>
                        handleToggleRead(message.id, message.isRead)
                      }
                      disabled={isUpdating === message.id}
                      variant="outline"
                      size="sm"
                    >
                      {message.isRead ? (
                        <>
                          <Mail size={16} className="mr-2" />
                          Marquer comme non lu
                        </>
                      ) : (
                        <>
                          <MailOpen size={16} className="mr-2" />
                          Marquer comme lu
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleDelete(message.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </Button>

                    <a
                      href={`mailto:${message.email}`}
                      className="ml-auto"
                    >
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                        Répondre par email
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-0 shadow-md">
            <Mail size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Aucun message pour le moment</p>
          </Card>
        )}
      </div>
    </div>
  );
}
