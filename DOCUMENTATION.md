# TaskMaster Documentation

Live deployment: https://taskmaster-ashy.vercel.app/

## Overview
TaskMaster is a task management app with dashboards, task CRUD, calendar, reports, and settings. 
We use Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui components, MongoDB, Zustand for client state, react-hook-form with Zod for forms, Recharts for visualization, and JWT authentication.

## Project Structure
The `app` directory holds all App Router pages and API route handlers. Subfolders `dashboard`, `tasks`, `calendar`, `categories`, `settings`, and `tasks/report` implements feature pages. The `app/api` branch exposes the REST endpoints for authentication, profile, categories, tasks, stats, and testing helpers.

The `components` directory stores shared UI pieces, including the navbar, theme provider, shared layouts such as the page shell, reusable data table helpers, and the shadcn primitives under `components/ui`.

Custom hooks live in `hooks`, for example `use-require-auth`, `use-task-report`, and `use-toast`, which wrap state and behavior that needs to be reused across pages.

The `lib` directory contains utilities shared between client and server such as the API client wrappers, MongoDB connection logic, JWT helpers, Zustand stores under `lib/store`, serializers for Mongo documents, constants, and helper functions.

Static assets and icons live in `public`. Styling and build configuration files such as `globals.css`, `components.json`, and `postcss.config.mjs` sit at the root along with `next.config.ts`, `package.json`, `tsconfig.json`, and the README.

## Data Flow
Authentication lives under `app/api/auth`. Passwords are hashed with bcryptjs. Successful login returns a JWT signed with `JWT_SECRET` and helpers in `lib/auth.ts` manage it on the client.

Database access is centralized in `lib/mongodb.ts`, which caches the Mongo connection using `MONGODB_URI`. API routes call Mongo collections through helper functions and serialize the result before returning.

Client state is handled by pulling data via `lib/api/*` wrappers and storing it in Zustand. UI components rely on shadcn primitives plus Recharts for visualizations. Dialogs and forms use react-hook-form with Zod validation, and notifications surface through the shared toast hook backed by Sonner.

## UML
categories
| Field | Type |
| --- | --- |
| _id | ObjectId |
| userId | ObjectId |
| name | string |
| description | string |
| color | string |
| icon | string |
| createdAt | ISODate |
| updatedAt | ISODate |

tasks
| Field | Type |
| --- | --- |
| _id | ObjectId |
| userId | ObjectId |
| title | string |
| description | string |
| category | ObjectId |
| priority | "low" \| "medium" \| "high" |
| status | "pending" \| "completed" \| "overdue" |
| dueDate | ISODate |
| createdAt | ISODate |
| updatedAt | ISODate |

users
| Field | Type |
| --- | --- |
| _id | ObjectId |
| name | string |
| email | string |
| password | string |
| createdAt | ISODate |
| updatedAt | ISODate |

UML relationships
- A user owns many categories (`categories.userId` → `users._id`).
- A user owns many tasks (`tasks.userId` → `users._id`).
- Each task can belong to one category owned by the same user (`tasks.category` → `categories._id`).

Please refer to README.md for running instructions

