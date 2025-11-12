# Project Architecture

This project follows Next.js App Router best practices with a feature-based component structure.

## Directory Structure

```
bh-knowledge-bot/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group (shared layout)
│   │   └── login/              # Login page
│   ├── (dashboard)/            # Dashboard route group (protected)
│   │   ├── dashboard/          # Main dashboard view
│   │   ├── chat/[id]/          # Individual chat thread (dynamic route)
│   │   ├── analytics/          # Analytics & insights page
│   │   └── layout.tsx          # Shared layout with auth check
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root page (redirects)
│   └── globals.css             # Global styles
├── components/
│   ├── features/               # Feature-specific components
│   │   ├── auth/              # Authentication components
│   │   │   ├── login.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/         # Dashboard feature components
│   │   │   ├── dashboard.tsx
│   │   │   ├── chat-interface.tsx
│   │   │   └── index.ts
│   │   └── analytics/         # Analytics feature components
│   │       ├── stats.tsx
│   │       └── index.ts
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── avatar.tsx
│   │   └── ...
│   ├── chat-hover-card.tsx    # Reusable chat components
│   ├── conversation-actions-menu.tsx
│   ├── create-project-dialog.tsx
│   ├── delete-confirmation-dialog.tsx
│   ├── project-folder.tsx
│   ├── project-conversation-actions-menu.tsx
│   ├── rename-conversation-dialog.tsx
│   ├── rename-project-dialog.tsx
│   └── suggested-questions.tsx
├── lib/                       # Utility functions and types
│   ├── types.ts              # Shared TypeScript types
│   ├── mock-data.ts          # Mock data for development
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
    └── beaird-harris-logo.png

```

## Routing

### Authentication Routes
- `/login` - Login page (public)
- `/` - Root redirects to `/dashboard` if authenticated, `/login` otherwise

### Protected Routes (Dashboard)
- `/dashboard` - Main dashboard view
- `/chat/[id]` - Individual chat thread by UUID
- `/analytics` - Analytics & insights page

All routes under `(dashboard)` are protected by the layout's authentication check.

## Data Flow

### Authentication
- Uses localStorage for authentication state (production: replace with proper auth)
- Protected routes check authentication in layout component
- Redirects to `/login` if not authenticated

### Chat Navigation
- Clicking a conversation in the sidebar navigates to `/chat/[id]`
- Uses Next.js App Router navigation for client-side routing
- Maintains conversation state across navigation

### State Management
Currently using React component state. For production, consider:
- React Context for global state
- Zustand or Redux for complex state management
- SWR or React Query for server state

## Component Organization

### Feature-based Structure
Components are organized by feature (auth, dashboard, analytics) rather than type.
This makes it easier to:
- Locate related components
- Understand dependencies
- Extract features into separate packages if needed

### Shared Components
- `components/ui/` - Base UI components (buttons, inputs, etc.)
- `components/` (root) - Shared business logic components used across features

## Type Safety

All shared types are defined in `lib/types.ts`:
- `Conversation` - Chat conversation metadata
- `ConversationMessage` - Individual messages
- `Project` - Project/folder data
- `ProjectFile` - File metadata

## Future Improvements

1. **Extract Chat View** - Create standalone chat component separate from dashboard
2. **Add Server Components** - Use RSC for static content where possible
3. **API Routes** - Replace mock data with actual API calls
4. **Real Authentication** - Implement proper auth (NextAuth.js, Clerk, etc.)
5. **State Management** - Add context providers or state library
6. **Data Fetching** - Implement SWR/React Query for server data
7. **Middleware** - Add auth middleware for route protection
8. **Loading States** - Add proper loading.tsx files for each route
9. **Error Handling** - Add error.tsx files for error boundaries
10. **SEO** - Add metadata to each page

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Notes

- Route groups `(auth)` and `(dashboard)` don't affect URLs
- Dynamic route `[id]` matches any chat UUID
- All client components use `"use client"` directive
- Currently using mock data (see `lib/mock-data.ts`)
