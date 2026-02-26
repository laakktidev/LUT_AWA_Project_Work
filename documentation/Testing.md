# Testing Overview

This document provides a high‑level overview of the testing strategy for both backend (server) and frontend (client). It reflects the actual tests implemented and executed during the project.

## Test Types

The project uses two complementary testing layers:

- Backend: unit tests and integration tests
    
- Frontend: end‑to‑end (E2E) tests
    

## Backend Tests

Backend testing is divided into integration tests (API‑level) and unit tests (service‑level).

### Integration Tests

Tools: Jest, Supertest, mongodb-memory-server Location: /backend/tests/integration

These tests validate full API behavior, including routing, controllers, middleware, and database interactions.

Files:

- documentCloneRoutes.test.ts
    
- documentFileRoutes.test.ts
    
- documentRoutes.test.ts
    
- documentSearchRoutes.test.ts
    
- documentShareRoutes.test.ts
    
- documentTrashRoutes.test.ts
    
- userRoutes.test.ts
    

Covers:

- User authentication
    
- Document CRUD
    
- Document cloning
    
- Document search
    
- Document sharing
    
- Document trash and restore
    
- File uploads
    
- User routes
    

### Unit Tests

Tools: Jest Location: /backend/tests/unit

These tests validate business logic inside service layers without touching the API or database.

Files:

- documentCloneService.test.ts
    
- documentLockService.test.ts
    
- documentSearchService.test.ts
    
- documentService.test.ts
    
- documentShareService.test.ts
    
- documentTrashService.test.ts
    
- userAuthService.test.ts
    

### [Server Test Results](Server_Test_Results.md)

Covers:

- Document service logic
    
- Locking logic
    
- Search logic
    
- Sharing logic
    
- Trash and restore logic
    
- Authentication logic
    

## Frontend Tests (E2E)

Frontend tests are implemented using Playwright and executed in Chromium and Firefox.

Location: /frontend/tests

Actual tests executed:

### Login

- user can log in successfully (Chromium)
    
- user can log in successfully (Firefox)
    

### Registration

- user can register successfully (Chromium)
    
- user can register successfully (Firefox)
    

### Create Document

- user can create a new document (Chromium)
    
- user can create a new document (Firefox)
    

### Edit Document

- user can edit an existing document (Chromium)
    
- user can edit an existing document (Firefox)
    

### Delete Document

- user can delete a document (Chromium)
    
- user can delete a document (Firefox)
    

These tests verify the core user flows and ensure cross‑browser reliability.

### [Client Test Results](Client_Test_Results.md)

