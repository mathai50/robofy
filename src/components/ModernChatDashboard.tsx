'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Bell, Settings, HelpCircle, Filter, X, Search, BarChart3, Globe, Users, TrendingUp, FileText, Sparkles, Zap, Calendar, Copy, Expand, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface Module {
  id: string;
  type: 'user-query' | 'agent-response';
  content: string;
  timestamp: Date;
  agentId?: string;
  expanded: boolean;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ModernChatDashboardProps {
  toolName: string;
  toolDescription: string;
  apiEndpoint: string;
  agents: Agent[];
  defaultAgent?: string;
  placeholder?: string;
  welcomeMessage?: string;
  agentEndpoints?: Record<string, string>;
}

export default function ModernChatDashboard({
  toolName,
  toolDescription,
  apiEndpoint,
  agents,
  defaultAgent = 'seo-audit',
  placeholder = "Ask or search for anything...",
  welcomeMessage = "Welcome to your research workspace. Select an agent to begin analysis.",
  agentEndpoints = {}
}: ModernChatDashboardProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState(defaultAgent);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Removed auto-scroll to bottom functionality
  // const scrollToBottom = () => {
  //   workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [modules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user query module
    const userModule: Module = {
      id: Date.now().toString(),
      type: 'user-query',
      content: input,
      timestamp: new Date(),
      expanded: true
    };
    setModules(prev => [...prev, userModule]);
    setInput('');

    try {
      // Determine the endpoint to use
      const endpoint = agentEndpoints?.[activeAgent] || apiEndpoint;
      const isDirectEndpoint = agentEndpoints?.[activeAgent] !== undefined;

      let requestBody;
      if (isDirectEndpoint) {
        // Format request body based on active agent for direct endpoints
        switch (activeAgent) {
          case 'seo-audit':
          case 'technical-seo':
            requestBody = JSON.stringify({ url: input });
            break;
          case 'competitor-analysis':
            let domain = input;
            // Extract domain from URL if input is a full URL
            const urlMatch = input.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
              try {
                const url = new URL(urlMatch[0]);
                domain = url.hostname;
              } catch {
                // If URL parsing fails, use input as is
              }
            }
            requestBody = JSON.stringify({ domain: domain });
            break;
          case 'keyword-research':
            requestBody = JSON.stringify({ topic: input });
            break;
          case 'performance-metrics':
            requestBody = JSON.stringify({ domain: input, keywords: [input] });
            break;
          default:
            requestBody = JSON.stringify({ message: input });
        }
      } else {
        requestBody = JSON.stringify({
          message: input,
          tool: toolName.toLowerCase().replace(/\s+/g, '-'),
          agent: activeAgent
        });
      }

      // Prepare headers with authorization if available
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Try to get auth token using AuthService
      const token = AuthService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: requestBody,
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.detail) {
            // Handle FastAPI error format
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to use this feature.');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Handle multiple response formats from backend endpoints
      let responseContent;
      if (data.response) {
        // Standard success response from /api/ai/message
        responseContent = data.response;
      } else if (data.analysis) {
        // SEO analysis endpoints return analysis field
        responseContent = data.analysis;
      } else if (data.error?.message) {
        // Error response from backend
        responseContent = `Error: ${data.error.message}`;
      } else {
        // Fallback for unexpected response format
        responseContent = 'Received unexpected response format from server';
      }
      
      // Add agent response module
      const agentModule: Module = {
        id: (Date.now() + 1).toString(),
        type: 'agent-response',
        content: responseContent,
        timestamp: new Date(),
        agentId: activeAgent,
        expanded: true
      };
      setModules(prev => [...prev, agentModule]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to process request. Please try again.');
      
      let errorMessage = 'Sorry, there was an error processing your request. Please try again.';
      if (err instanceof Error && err.message.includes('Authentication required')) {
        errorMessage = 'Authentication required. Please log in to use SEO analysis features.';
      }
      
      const errorModule: Module = {
        id: (Date.now() + 1).toString(),
        type: 'agent-response',
        content: errorMessage,
        timestamp: new Date(),
        agentId: activeAgent,
        expanded: true
      };
      setModules(prev => [...prev, errorModule]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(module =>
      module.id === id ? { ...module, expanded: !module.expanded } : module
    ));
  };

  const currentAgent = agents.find(agent => agent.id === activeAgent);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-normal">{toolName}</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <span>•</span>
              <span>{toolDescription}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`bg-gray-800 border-r border-gray-700 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'w-14' : 'w-64'
          }`}>
            {/* Sidebar Toggle */}
            <div className={`border-b border-gray-700 ${isSidebarCollapsed ? 'p-0.5 flex justify-center' : 'p-0.5'}`}>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-0 hover:bg-gray-700 rounded transition-colors"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-2 h-2" /> : <ChevronLeft className="w-2 h-2" />}
              </button>
            </div>

            <div className={`${isSidebarCollapsed ? 'p-1' : 'p-2'}`}>
              {/* Research Agents Section */}
              {!isSidebarCollapsed && (
                <h2 className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">RESEARCH AGENTS</h2>
              )}
              <div className="space-y-[9px] max-h-[420px] overflow-y-auto">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent.id)}
                    className={`w-full transition-all flex items-center h-[42px] ${
                      activeAgent === agent.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    } ${isSidebarCollapsed ? 'justify-center p-2' : 'px-2 py-2 text-left'}`}
                    title={isSidebarCollapsed ? agent.name : ''}
                  >
                    <div className={`${isSidebarCollapsed ? '' : 'mr-2'}`}>
                      {React.cloneElement(agent.icon as React.ReactElement, {
                        className: `w-4 h-4 ${isSidebarCollapsed ? '' : 'flex-shrink-0'}`
                      })}
                    </div>
                    {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-medium truncate">{agent.name}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Workspace Tools Section */}
              {!isSidebarCollapsed && (
                <h2 className="text-xs font-normal text-gray-400 uppercase tracking-wide mt-4 mb-2">WORKSPACE TOOLS</h2>
              )}
              <div className="space-y-2">
                <button className={`w-full flex items-center rounded transition-colors hover:bg-gray-700 ${
                  isSidebarCollapsed ? 'justify-center p-2' : 'px-2 py-2 text-sm text-gray-300'
                }`} title="Knowledge Base">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="ml-2">Knowledge Base</span>}
                </button>
                <button className={`w-full flex items-center rounded transition-colors hover:bg-gray-700 ${
                  isSidebarCollapsed ? 'justify-center p-2' : 'px-2 py-2 text-sm text-gray-300'
                }`} title="Export Research">
                  <Download className="w-4 h-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="ml-2">Export Research</span>}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col">
          {/* Command Bar */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter full URL including https://"
                      className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-700 text-gray-100 placeholder-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>Analyze</span>
                  </button>
                </form>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Active Agent:</span>
                <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                  {currentAgent?.icon}
                  <span className="text-sm">{currentAgent?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Workspace - Removed overflow-y-auto to use browser scroll */}
          <div className="flex-1 px-6 py-4">
            {modules.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-normal mb-2">{welcomeMessage}</h3>
                  <p className="text-gray-400">Enter a query above to begin your research analysis.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`border border-gray-700 rounded-lg overflow-hidden ${
                      module.type === 'user-query' ? 'bg-gray-800' : 'bg-gray-800'
                    }`}
                  >
                    {/* Module Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {module.type === 'agent-response' && module.agentId && (
                          <div className="p-2 rounded bg-gray-700">
                            {agents.find(a => a.id === module.agentId)?.icon}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">
                            {module.type === 'user-query' ? 'Your Query' :
                             agents.find(a => a.id === module.agentId)?.name || 'AI Response'}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {module.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-600 rounded">
                          {module.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Module Content */}
                    {module.expanded && (
                      <div className="p-4 border-t border-gray-700">
                        <div className="prose prose-invert prose-sm max-w-none">
                          <p className="text-gray-200">{module.content}</p>
                        </div>
                        
                        {/* Action Bar - Reduced size and simplified */}
                        {module.type === 'agent-response' && (
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                            <div className="flex space-x-1">
                              <button className="flex items-center space-x-1 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
                                <Copy className="w-2.5 h-2.5" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <div className="flex space-x-1">
                              <button className="flex items-center space-x-1 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>View Dashboard</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="border border-gray-700 rounded-lg bg-gray-800 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-gray-700">
                        {currentAgent?.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">Analyzing...</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                          </div>
                          <span className="text-sm text-gray-400">Processing your request</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={workspaceRef} />
          </div>
        </main>
      </div>
    </div>
  );
}