import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Paper, Avatar, IconButton, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `You are HealMotion AI Coach — a warm, knowledgeable physiotherapy assistant. You help users with:
- Exercise recommendations based on their condition
- Form tips and technique advice
- Pain management guidance
- Recovery planning
- Motivational support

Be encouraging, use simple language, and always remind users to consult their healthcare provider for medical decisions. Keep responses concise (2-3 paragraphs max). Use emojis sparingly for warmth.`;

async function callOpenRouter(messages) {
  const apiKey = localStorage.getItem('healmotion_openrouter_key');
  if (!apiKey) {
    return { error: 'Please set your OpenRouter API key in settings to use AI Coach.' };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HealMotion',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-20250514',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return { error: err.error?.message || 'AI request failed' };
    }

    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content || 'No response' };
  } catch (err) {
    return { error: 'Network error. Check your connection.' };
  }
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: uuidv4(), role: 'assistant', content: 'Hey! 👋 I\'m your AI rehab coach. Tell me about your condition or what you\'d like to work on today, and I\'ll help create a plan.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('healmotion_openrouter_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('healmotion_openrouter_key'));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: uuidv4(), role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    scrollToBottom();

    const chatHistory = newMessages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
    const result = await callOpenRouter(chatHistory);

    if (result.error) {
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: `⚠️ ${result.error}` }]);
    } else {
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: result.content }]);
    }
    setLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const saveKey = () => {
    localStorage.setItem('healmotion_openrouter_key', apiKey);
    setShowKeyInput(false);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fdfcf6' }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
        <IconButton onClick={() => navigate('/dashboard')}><ArrowBackIcon /></IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e1894f' }}>AI Coach</Typography>
          <Typography variant="caption" color="text.secondary">Powered by Claude • OpenRouter</Typography>
        </Box>
      </Box>

      {/* API Key prompt */}
      {showKeyInput && (
        <Box sx={{ p: 2, bgcolor: '#fef9f0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Enter your OpenRouter API key to enable AI Coach:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              type="password"
            />
            <Button variant="contained" onClick={saveKey} disabled={!apiKey}
              sx={{ background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)', whiteSpace: 'nowrap' }}>
              Save
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Get a free key at openrouter.ai • Your key stays on your device
          </Typography>
        </Box>
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
        {messages.map(msg => (
          <Box key={msg.id} sx={{ display: 'flex', mb: 2, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#e1894f', mr: 1, fontSize: '0.8rem' }}>AI</Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                maxWidth: '75%',
                bgcolor: msg.role === 'user' ? '#e1894f' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {msg.content}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e1894f', fontSize: '0.8rem' }}>AI</Avatar>
            <CircularProgress size={20} sx={{ color: '#e1894f' }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box component="form" onSubmit={handleSend}
        sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about exercises, pain management, recovery..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton type="submit" disabled={!input.trim() || loading}
          sx={{ bgcolor: '#e1894f', color: '#fff', '&:hover': { bgcolor: '#b5613a' }, '&:disabled': { bgcolor: '#ccc' } }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
