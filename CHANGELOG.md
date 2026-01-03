# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

#### Phase 1: Chat Components Extraction

- Extracted `ChatMessage` component to `@semwerk/react` for reuse across semstudio and sempress
  - Location: `packages/react/src/components/chat/ChatMessage/`
  - Supports user and assistant messages with citation rendering
  - Props: `message`, `className`, `renderCitation`
  - TypeScript types: `ChatMessageProps`, `Citation`

- Extracted `CitationCard` component to `@semwerk/react`
  - Location: `packages/react/src/components/chat/CitationCard/`
  - Displays citations with document and code coordinate support
  - Props: `citation`, `className`
  - TypeScript types: `CitationCardProps`

#### Phase 2: Data Display Components

- Added `StatCard` component to `@semwerk/react`
  - Location: `packages/react/src/components/data-display/StatCard/`
  - Generic, reusable stat display component used in Dashboard and Library pages
  - Props: `title`, `value`, `description`, `icon`, `trend`, `className`
  - TypeScript types: `StatCardProps`
  - Supports trend indicators with directional styling (green for positive, red for negative)

### Changed

- Updated `@semwerk/react` exports in `packages/react/src/index.ts`:
  - Added `chat` component exports (ChatMessage, CitationCard)
  - Added `data-display` component exports (StatCard)

- Added `lucide-react` to `@semwerk/react` dependencies for icon support

- Updated `tsup` build configuration:
  - Added `lucide-react` to external dependencies list

### Fixed

- Removed unused `React` import from `CitationCard.tsx` to resolve build warnings

## Component Migration Status

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| ChatMessage | Done | `packages/react/src/components/chat/ChatMessage` | Extracted from semstudio |
| CitationCard | Done | `packages/react/src/components/chat/CitationCard` | Extracted from semstudio |
| StatCard | Done | `packages/react/src/components/data-display/StatCard` | Extracted from semstudio |

## Import Examples

After migration, use these imports in any package:

```typescript
// Chat components
import { ChatMessage, CitationCard } from '@semwerk/react'

// Data display
import { StatCard } from '@semwerk/react'

// Existing components
import { Button, Card, Badge, Input } from '@semwerk/react'
```
