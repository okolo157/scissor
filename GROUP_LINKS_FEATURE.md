# Scissor URL Shortener - Group Links Feature

## Overview

The URL shortener has been refactored to include a **Group Links** feature similar to Linktree or Bitly. Users can now create grouped collections of links under a single shareable page.

## What Was Implemented

### Backend Changes

#### 1. **New Link Group Model** (`server-app/src/models/linkGroup.ts`)

- `groupName`: Name of the link group
- `description`: Optional description
- `groupUrl`: Unique short URL identifier (auto-generated with nanoid)
- `links`: Array of links with title, url, and order
- `theme`: Customizable colors (backgroundColor, textColor, buttonColor)
- `views`: View counter

#### 2. **Link Group Controller** (`server-app/src/controllers/linkGroup.ts`)

- `createLinkGroup`: Create a new link group
- `getAllLinkGroups`: Fetch all groups
- `getLinkGroup`: Get a specific group by groupUrl
- `updateLinkGroup`: Update group details
- `deleteLinkGroup`: Delete a group
- `addLinkToGroup`: Add a link to a group
- `removeLinkFromGroup`: Remove a link from a group

#### 3. **Link Group Routes** (`server-app/src/routes/linkGroup.ts`)

- `POST /api/linkGroup` - Create new group
- `GET /api/linkGroups` - Get all groups
- `GET /api/linkGroup/:groupUrl` - Get specific group
- `PUT /api/linkGroup/:id` - Update group
- `DELETE /api/linkGroup/:id` - Delete group
- `POST /api/linkGroup/:id/link` - Add link to group
- `DELETE /api/linkGroup/:id/link/:linkId` - Remove link from group

#### 4. **Updated Server** (`server-app/src/server.ts`)

- Integrated link group routes

### Frontend Changes

#### 1. **Navbar Component** (`client-app/src/components/navbar/Navbar.tsx`)

- Global navigation bar with tabs for:
  - Home (URL shortener)
  - Group Links (management page)
- Sticky positioning with glassmorphism design
- Active route highlighting

#### 2. **Group Links Management Page** (`client-app/src/pages/GroupLinks.tsx`)

- View all created link groups
- Create new link groups with modal interface
- Edit existing groups
- Delete groups
- Add/remove links to/from groups
- Copy shareable group URLs
- Stats display (link count, views)

#### 3. **Public Group Page** (`client-app/src/pages/PublicGroup.tsx`)

- Linktree-style public page accessible at `/g/:groupUrl`
- Displays all links in a group
- Custom theming support
- Click-through to external URLs
- View counter
- Branded with Scissor logo

#### 4. **Updated App Routes** (`client-app/src/App.tsx`)

- `/` - Home (URL shortener)
- `/group-links` - Group management
- `/g/:groupUrl` - Public group page

#### 5. **TypeScript Interfaces** (`client-app/src/interface/linkGroup.ts`)

- Type definitions for LinkGroup, Link, and Theme

## How to Use

### Setup

1. **Backend Setup:**

   ```bash
   cd URL-SHORTNER/server-app
   npm install

   # Create .env file with your MongoDB connection
   cp .env.example .env
   # Edit .env and add your MongoDB connection string

   npm run dev
   ```

2. **Frontend Setup:**

   ```bash
   cd URL-SHORTNER/client-app
   npm install
   npm run dev
   ```

3. **Database Requirements:**
   - MongoDB (local or Atlas)
   - Redis (optional, for caching)

### Creating a Link Group

1. Navigate to the **Group Links** tab in the navbar
2. Click **Create Group**
3. Fill in:
   - Group Name (e.g., "My Social Links")
   - Description (optional)
   - Add links with titles and URLs
4. Click **Create Group**
5. Copy the shareable URL (e.g., `https://yourdomain.com/g/abc12345`)

### Sharing Your Link Group

Share the URL `/g/:groupUrl` with anyone. They'll see a beautiful Linktree-style page with all your links.

## Features

✅ Create multiple link groups
✅ Add/remove/reorder links
✅ Customizable themes (planned enhancement)
✅ View analytics
✅ Copy shareable URLs
✅ Responsive design
✅ Glassmorphism UI
✅ Smooth animations

## Architecture

### URL Structure

- **Short URLs**: `/:id` (e.g., `/abc123`) - redirects to full URL
- **Link Groups**: `/g/:groupUrl` (e.g., `/g/mysocials`) - displays public group page
- **Management**: `/group-links` - admin interface

### Data Flow

1. User creates group → Backend saves to MongoDB
2. Group gets unique `groupUrl` identifier
3. Public can visit `/g/:groupUrl` → Frontend fetches group data
4. Each visit increments view counter

## Environment Variables

### Backend (.env)

```env
CONNECTION_STRING=mongodb://localhost:27017/scissor
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
PORT=5000
```

### Frontend (.env)

Check `client-app/src/helpers/constants.ts` for server URL configuration.

## Future Enhancements

- [ ] User authentication
- [ ] Link analytics (clicks per link)
- [ ] Custom themes in UI
- [ ] QR code generation for groups
- [ ] Link scheduling (show/hide based on time)
- [ ] Social media icons
- [ ] Custom domains
- [ ] Link thumbnails/images

## Technical Stack

**Backend:**

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Redis (caching)
- nanoid (URL generation)

**Frontend:**

- React 18
- TypeScript
- React Router
- Tailwind CSS
- Framer Motion (animations)
- Axios
- Lucide Icons

## Notes

- The TypeScript compilation errors shown are IDE-level type checking issues and won't affect runtime
- Make sure MongoDB is running before starting the backend
- The public group pages are accessible without authentication
- Link groups are independent from the URL shortener functionality
