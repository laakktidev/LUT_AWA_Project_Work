## Technology Choices

This project is built with a modern, scalable, and maintainable full‑stack architecture. The following sections describe the key technologies and the reasoning behind each choice. A complete list of all client‑side and server‑side dependencies is provided in **Appendix A (Client Dependencies)** and **Appendix B (Server Dependencies)**.

## Frontend

### React + TypeScript

- **Why:** Strong typing reduces runtime errors and improves maintainability.
    
- **Benefit:** Predictable component behavior, safer refactoring, excellent IDE support.
    

### Vite

- **Why:** Extremely fast development server and optimized build pipeline.
    
- **Benefit:** Instant HMR, minimal configuration, and excellent performance for modern React apps.
    

### React Router

- **Why:** Declarative routing for single‑page applications.
    
- **Benefit:** Clean URL structure and seamless navigation.
    

### Material UI (MUI)

- **Why:** Mature, accessible, production‑ready component library.
    
- **Benefit:** Consistent design system, responsive layout, reduced UI development time.
    

### Tiptap Editor

- **Why:** Modern, extensible rich‑text editor built on ProseMirror.
    
- **Benefit:** Supports images, formatting, custom extensions, and HTML output.
    

### i18next

- **Why:** Flexible and scalable internationalization framework.
    
- **Benefit:** Easy to add languages and dynamic translations.
    

### EmailJS (`@emailjs/browser`)

- **Why:** Enables sending emails directly from the client without a backend mail server.
    
- **Benefit:** Used for share‑via‑email functionality and quick client‑side email delivery.
    

---
## Backend

### Node.js + Express

- **Why:** Lightweight, fast, ideal for REST APIs.
    
- **Benefit:** Easy integration with MongoDB and JSON‑based communication.
    

### MongoDB + Mongoose

- **Why:** Schema‑flexible document database.
    
- **Benefit:** Perfect for storing HTML content, metadata, and user permissions.
    

### JWT Authentication

- **Why:** Stateless authentication works well with SPAs.
    
- **Benefit:** No server‑side session storage; scalable and secure.
    

### Multer

- **Why:** Efficient middleware for handling file uploads.
    
- **Benefit:** Used for profile pictures and image uploads inside documents.
    

### Nodemailer / Resend

- **Why:** Reliable email delivery for share‑via‑email features.
    
- **Benefit:** Supports both development (Nodemailer) and production (Resend) email workflows.
    

### PDFKit

- **Why:** Server‑side PDF generation library.
    
- **Benefit:** Enables exporting documents and slides as downloadable PDF files.
    

## Document Locking System

### Custom Locking Service

- **Why:** Prevents concurrent edits and data conflicts.
    
- **Benefit:** Only one user can edit a document at a time; others see a lock warning.
    

## File Uploads

### Image Upload API

- **Why:** Allows embedding images directly into the editor.
    
- **Benefit:** Uploaded images are stored and automatically replaced inside the HTML content.

---

## Appendix A — Client Dependencies Overview

This frontend is a React + Vite application written in TypeScript. The following lists describe all runtime and development dependencies used in the client, along with their purpose in the project.

### Runtime Dependencies

These packages are required when the application runs in the browser.

- **@emailjs/browser** — Enables sending emails directly from the client (share‑via‑email).
    
- **@emotion/react**, **@emotion/styled** — Styling engine used by Material‑UI for theming and dynamic styles.
    
- **@mui/material**, **@mui/icons-material** — Component library and icon set used for layout, dialogs, forms, and UI structure.
    
- **@tiptap/extension-image**, **@tiptap/react**, **@tiptap/starter-kit** — Tiptap rich‑text editor ecosystem powering the document and slide editors.
    
- **axios** — HTTP client for communicating with the backend API.
    
- **i18next**, **i18next-browser-languagedetector**, **react-i18next** — Internationalization framework for multi‑language support (EN/FI).
    
- **jwt-decode** — Decodes JWT tokens on the client to extract user information.
    
- **react**, **react-dom** — Core React libraries for UI rendering.
    
- **react-router-dom** — Client‑side routing for navigation between pages.
    

### Development Dependencies

These packages are used during development, building, or documentation.

- **typescript** — TypeScript compiler.
    
- **vite** — Development server and build tool.
    
- **@vitejs/plugin-react** — Adds React support to Vite.
    
- **Type definitions** — TypeScript types for Node, React, React Router, JSON Web Tokens, etc.
    
- **typedoc** — Generates API documentation from TypeScript comments.
    
- **Testing tools** — Playwright, Cypress, Vitest, Testing Library, MSW for automated testing.
    

## Appendix B — Server Dependencies Overview

This backend is a Node.js + Express application written in TypeScript. The following lists describe all runtime and development dependencies used in the server.

### Runtime Dependencies

These packages are required when the server runs in production.

- **bcrypt** — Hashes and verifies user passwords securely.
    
- **cors** — Enables cross‑origin requests from the React client.
    
- **dotenv** — Loads environment variables (JWT secret, MongoDB URI, email credentials).
    
- **express** — Core HTTP server framework for routing and middleware.
    
- **express-validator** — Validates and sanitizes incoming request data.
    
- **html-to-text** — Converts HTML to plain text (used for email content).
    
- **jsonwebtoken** — Creates and verifies JWT tokens for authentication.
    
- **mongoose** — ODM for defining schemas and interacting with MongoDB.
    
- **morgan** — HTTP request logger for debugging.
    
- **multer** — Handles file uploads (profile pictures, embedded images).
    
- **nodemailer** — Email sending library for development and local testing.
    
- **resend** — Production‑grade email delivery API.
    
- **path** — Node.js utility for safe file path handling.
    
- **pdfkit** — Generates PDF files for document and slide exports.
    
- **quill** — Rich‑text engine used server‑side for handling Quill delta formats.
    

### Development Dependencies

These packages are used during development, building, or documentation.

- **typescript** — TypeScript compiler.
    
- **ts-node** — Runs TypeScript directly without compiling.
    
- **tsc-watch** — Automatically rebuilds on file changes.
    
- **nodemon** — Restarts the server automatically during development.
    
- **Type definitions** — TypeScript types for Express, Multer, Morgan, JWT, PDFKit, etc.
    
- **typedoc** — Generates API documentation from TypeScript comments.
    
- **supertest** — Used for API endpoint testing.
