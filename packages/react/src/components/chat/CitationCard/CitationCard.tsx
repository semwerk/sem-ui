import { FileText, Box, Code, Map, BookOpen, ExternalLink } from 'lucide-react'

export interface CitationCardProps {
  citation: {
    id: string
    kind: string
    title: string
    url?: string | null
    excerpt?: string | null
    confidence?: number | null
  }
  onClick?: () => void
  className?: string
}

export function CitationCard({ citation, onClick, className = '' }: CitationCardProps) {
  const Icon = getCitationIcon(citation.kind)

  const handleClick = () => {
    if (citation.url) {
      window.open(citation.url, '_blank', 'noopener,noreferrer')
    }
    onClick?.()
  }

  return (
    <div
      className={`cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg p-3 ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate text-gray-900">{citation.title}</p>
            {citation.url && <ExternalLink className="h-3 w-3 text-gray-400 shrink-0" />}
          </div>

          {citation.excerpt && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">{citation.excerpt}</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {formatCitationKind(citation.kind)}
            </span>
            {citation.confidence && (
              <span className="text-[10px] text-gray-500">
                {Math.round(citation.confidence * 100)}% relevance
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getCitationIcon(kind: string) {
  switch (kind) {
    case 'DOC_PAGE':
    case 'DOC_SECTION':
    case 'DOC_CHUNK':
      return FileText
    case 'ARTIFACT':
      return Box
    case 'CONCEPT':
      return BookOpen
    case 'JOURNEY':
      return Map
    case 'CODE_REF':
      return Code
    default:
      return FileText
  }
}

function formatCitationKind(kind: string): string {
  switch (kind) {
    case 'DOC_PAGE':
      return 'Page'
    case 'DOC_SECTION':
      return 'Section'
    case 'DOC_CHUNK':
      return 'Chunk'
    case 'ARTIFACT':
      return 'Artifact'
    case 'CONCEPT':
      return 'Concept'
    case 'JOURNEY':
      return 'Journey'
    case 'CODE_REF':
      return 'Code'
    default:
      return kind
  }
}
