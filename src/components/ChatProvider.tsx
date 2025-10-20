'use client';

import React, { useState } from 'react';
import AIChatWidget from '@/components/AIChatWidget';

export default function ChatProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <AIChatWidget isOpen={isChatOpen} onToggle={handleChatToggle} />
  );
}