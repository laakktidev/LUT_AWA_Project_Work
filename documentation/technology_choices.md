## Technology Choices

This project is built with a modern, scalable, and maintainable full‑stack architecture. Below is an overview of the key technologies and the reasoning behind each choice.


## Frontend

### React + TypeScript
- **Why:** Strong typing reduces runtime errors and improves maintainability.
- **Benefit:** Predictable component behavior, safer refactoring, excellent IDE support.

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

---

## Document Locking System

### Custom Locking Service
- **Why:** Prevents concurrent edits and data conflicts.
- **Benefit:** Only one user can edit a document at a time; others see a lock warning.



## File Uploads

### Image Upload API
- **Why:** Allows embedding images directly into the editor.
- **Benefit:** Uploaded images are stored and automatically replaced inside the HTML content.
