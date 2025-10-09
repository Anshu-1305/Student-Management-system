import React, { useState } from 'react';
import { MessageCircle, Send, Search, User, Clock, Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

const ChatMessenger = ({ userRole = 'student' }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reportedMessages, setReportedMessages] = useState([]);

  const contacts = userRole === 'student' ? [
    { id: 1, name: 'Sumalatha Ma\'am', role: 'faculty', subject: 'Data Structures', online: true, lastSeen: 'Online' },
    { id: 2, name: 'Dr. Sai Hareesh Sir', role: 'faculty', subject: 'Machine Learning', online: false, lastSeen: '2 hours ago' },
    { id: 3, name: 'Dr. Rajesh Kumar', role: 'faculty', subject: 'Computer Networks', online: true, lastSeen: 'Online' }
  ] : [
    { id: 1, name: 'Anshu Kumar', role: 'student', section: 'CSE-B', online: true, lastSeen: 'Online' },
    { id: 2, name: 'Priya Sharma', role: 'student', section: 'CSE-B', online: false, lastSeen: '1 hour ago' },
    { id: 3, name: 'Rahul Reddy', role: 'student', section: 'CSE-A', online: true, lastSeen: 'Online' }
  ];

  const messages = {
    1: [
      { id: 1, sender: 'other', text: 'Hello Anshu, do you have any doubts about today\'s Data Structures class?', time: '10:30 AM' },
      { id: 2, sender: 'me', text: 'Yes ma\'am, I have a doubt about binary trees implementation', time: '10:32 AM' },
      { id: 3, sender: 'other', text: 'Sure, let me explain. Which part specifically are you finding difficult?', time: '10:35 AM' },
      { id: 4, sender: 'me', text: 'The insertion and deletion operations in BST', time: '10:37 AM' }
    ],
    2: [
      { id: 1, sender: 'other', text: 'Good morning! How is your machine learning project progressing?', time: '9:15 AM' },
      { id: 2, sender: 'me', text: 'Good morning sir, I\'m working on the data preprocessing part', time: '9:20 AM' }
    ]
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim()) {
      // Security check for inappropriate content
      const inappropriateWords = ['spam', 'inappropriate', 'harmful'];
      const hasInappropriateContent = inappropriateWords.some(word => 
        message.toLowerCase().includes(word)
      );
      
      if (hasInappropriateContent) {
        alert('Message blocked: Contains inappropriate content');
        return;
      }
      
      alert(`${isEncrypted ? '🔒 Encrypted' : ''} Message sent: ${message}`);
      setMessage('');
    }
  };
  
  const blockUser = (userId) => {
    setBlockedUsers([...blockedUsers, userId]);
    alert('User blocked successfully');
  };
  
  const reportMessage = (messageId) => {
    setReportedMessages([...reportedMessages, messageId]);
    alert('Message reported to administrators');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-96 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Messages
            </h3>
            <button
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Privacy Settings"
            >
              <Shield className="h-4 w-4" />
            </button>
          </div>
          
          {showPrivacySettings && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  End-to-End Encryption
                </span>
                <button
                  onClick={() => setIsEncrypted(!isEncrypted)}
                  className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                    isEncrypted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                    isEncrypted ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                {isEncrypted ? (
                  <><CheckCircle className="h-3 w-3 mr-1 text-green-500" /> Messages are encrypted</>
                ) : (
                  <><AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" /> Messages are not encrypted</>
                )}
              </div>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredContacts.filter(contact => !blockedUsers.includes(contact.id)).map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedChat === contact.id ? 'bg-[#22c55e]/10 dark:bg-[#22c55e]/20' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-10 w-10 bg-[#22c55e]/10 dark:bg-[#22c55e]/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.lastSeen}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contact.subject || contact.section}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-[#22c55e]/10 dark:bg-[#22c55e]/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {contacts.find(c => c.id === selectedChat)?.name}
                      </h4>
                      {isEncrypted && (
                        <Lock className="h-3 w-3 ml-2 text-[#22c55e]" title="Encrypted Chat" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contacts.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => blockUser(selectedChat)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Block User"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages[selectedChat] || []).map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-end space-x-2">
                    <div className={`max-w-xs px-4 py-2 rounded-lg relative group ${
                      msg.sender === 'me' 
                        ? 'bg-[#22c55e] text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${
                          msg.sender === 'me' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {msg.time}
                        </p>
                        {isEncrypted && (
                          <Lock className={`h-2 w-2 ml-2 ${
                            msg.sender === 'me' ? 'text-green-200' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                    {msg.sender !== 'me' && (
                      <button
                        onClick={() => reportMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all duration-200"
                        title="Report Message"
                      >
                        <AlertTriangle className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isEncrypted ? "🔒 Type encrypted message..." : "Type your message..."}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] dark:bg-gray-700 dark:text-white"
                    maxLength={500}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {message.length}/500
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  {isEncrypted ? (
                    <><Shield className="h-3 w-3 mr-1 text-[#22c55e]" /> End-to-end encrypted</>
                  ) : (
                    <><AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" /> Not encrypted</>
                  )}
                </span>
                <span>Academic use only</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessenger;