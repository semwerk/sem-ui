import React from 'react'
import { Bot, User } from 'lucide-react'

export interface Citation {
  id: string
  kind: string
  title: string
  url?: string | null
  excerpt?: string | null
  confidence?: number | null
  docCoordinate?: {
    path: string
    anchor?: string
    headingPath?: string[]
  } | null
  codeCoordinate?: {
    repoUrl: string
    filePath: string
    lineStart: number
    lineEnd?: number
  } | null
}

export interface ChatMessageProps {
  message: {
    id: string
    role: 'USER' | 'ASSISTANT' | 'TOOL'
    content: string
    citations?: Citation[]
    dateCreated: string
  }
  className?: string
  renderCitation?: (citation: Citation) => React.ReactNode
}

export function ChatMessage({ message, className = '', renderCitation }: ChatMessageProps) {
  const isUser = message.role === 'USER'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} ${className}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex-1 space-y-2 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 max-w-[80%] ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="space-y-1 max-w-[80%]">
            <div className="text-xs font-medium text-gray-500 px-1">Sources</div>
            {message.citations.map((citation) =>
              renderCitation ? (
                <div key={citation.id}>{renderCitation(citation)}</div>
              ) : (
                <DefaultCitation key={citation.id} citation={citation} />
              )
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 px-1">
          {new Date(message.dateCreated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

function DefaultCitation({ citation }: { citation: Citation }) {
  return (
    <div className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
      {citation.title}
    </div>
  )
}
