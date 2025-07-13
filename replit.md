# Replit Project Guide

## Overview

This is a comprehensive Business Intelligence Tool for project managers to analyze competitor pricing and market trends with CRM integration capabilities. The application is built as a full-stack JavaScript application using React for the frontend and Node.js/Express for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Status:** Implemented

The system follows a modern full-stack architecture:

- **Frontend:** React with TypeScript, Vite for development, Wouter for routing
- **Backend:** Node.js with Express, TypeScript
- **Data Storage:** In-memory storage for development (MemStorage)
- **Styling:** Tailwind CSS with Shadcn/UI components
- **State Management:** TanStack Query for server state management
- **Form Handling:** React Hook Form with Zod validation

## Key Components

**Status:** Implemented

Key components of the Business Intelligence Tool:

- **Frontend Components:** 
  - Dashboard with analytics charts and KPIs
  - Companies management for competitor tracking
  - Products management for competitive analysis
  - Pricing Analysis with data visualization
  - Market Trends tracking and analysis
  - CRM Integrations for external system connectivity
  - Analysis Reports generation and management
  
- **Backend Components:**
  - RESTful API with Express.js
  - In-memory data storage (MemStorage)
  - CRUD operations for all entities
  - Data validation with Zod schemas
  
- **Database Layer:**
  - Schema definitions with TypeScript and Zod
  - In-memory storage for development
  - Support for Companies, Products, PricingData, MarketTrends, CRM Integrations, and Analysis Reports
  
- **UI Framework:**
  - Shadcn/UI components for consistent design
  - Dark/Light theme support
  - Responsive layout with mobile-first approach
  - Interactive charts using Recharts

## Data Flow

**Status:** Pending repository analysis

Data flow patterns to be documented:

- Request/response cycle
- Database interaction patterns
- Authentication flow
- External API communication

## External Dependencies

**Status:** Pending repository analysis

Dependencies to be catalogued:

- **Frontend Dependencies:** UI libraries, utilities
- **Backend Dependencies:** Frameworks, middleware, utilities
- **Database:** ORM/query builder (potentially Drizzle)
- **External APIs:** Third-party service integrations
- **Development Tools:** Build tools, testing frameworks

## Deployment Strategy

**Status:** Pending repository analysis

Deployment configuration to be documented:

- Build process
- Environment configuration
- Database setup (potentially Postgres with Drizzle)
- Production deployment steps

---

**Note:** This document needs to be updated with actual repository analysis once the codebase is available for review.