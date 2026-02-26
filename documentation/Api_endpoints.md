# REST API Endpoints


## User API

### Authentication

- POST /api/users/register — create a new user account
    
- POST /api/users/login — authenticate an existing user
    

### Profile

- POST /api/users/profile-picture — upload or update the user’s profile image
    

### User Listing

- GET /api/users — return all users (requires authentication)
    

## Document API

### Create and Read

- POST /api/document — create a new document
    
- GET /api/document — list all documents belonging to the authenticated user
    
- GET /api/document/search — search documents by title or content
    
- GET /api/document/:id — fetch a single document by ID
    

### Update

- PUT /api/document/:id — update document fields
    

### Delete

- DELETE /api/document/:id — permanently delete a document
    

## Document Trash API

- GET /api/document/trash — list soft‑deleted documents
    
- GET /api/document/trash/count — return number of deleted documents
    
- DELETE /api/document/trash/empty — permanently delete all trashed documents
    
- PATCH /api/document/:id/soft-delete — move a document to trash
    
- PATCH /api/document/:id/restore — restore a trashed document
    

## Document Sharing API

- PATCH /api/document/:id/editors — update list of users allowed to edit
    
- PATCH /api/document/:id/public — toggle public visibility
    

## Document Cloning

- POST /api/document/:id/clone — duplicate an existing document
    

## Document File Uploads and PDF

- POST /api/document/:id/images — upload images to a document
    
- GET /api/document/:id/pdf — generate a PDF version of the document
    

## Document Locking

- POST /api/document/:id/lock — lock a document for editing
    
- POST /api/document/:id/unlock — unlock a document
    

## Public Document Access

- GET /api/public/document/:id — view a public document without authentication
    

## Sharing via Email

- POST /api/share/public-link/:id — generate a public share link
    

## Presentation API

### CRUD

- POST /api/presentation — create a new presentation
    
- GET /api/presentation — list all presentations
    
- GET /api/presentation/:id — fetch a single presentation
    
- PATCH /api/presentation/:id — update presentation fields
    
- DELETE /api/presentation/:id — delete a presentation
    

### Search

- GET /api/presentation/search — search presentations by title or content
    

### Locking

- POST /api/presentation/:id/lock — lock a presentation for editing
    
- POST /api/presentation/:id/unlock — unlock a presentation
    

### Sharing

- PATCH /api/presentation/:id/editors — update list of editors
    

# Summary Table (All Endpoints)

| Area         | Method | Endpoint                      | Description             |
| ------------ | ------ | ----------------------------- | ----------------------- |
| User         | POST   | /api/users/register           | Create a new user       |
| User         | POST   | /api/users/login              | Authenticate user       |
| User         | POST   | /api/users/profile-picture    | Upload profile image    |
| User         | GET    | /api/users                    | List all users          |
| Document     | POST   | /api/document                 | Create document         |
| Document     | GET    | /api/document                 | List user documents     |
| Document     | GET    | /api/document/search          | Search documents        |
| Document     | GET    | /api/document/:id             | Get document by ID      |
| Document     | PUT    | /api/document/:id             | Update document         |
| Document     | DELETE | /api/document/:id             | Delete document         |
| Trash        | GET    | /api/document/trash           | List trashed documents  |
| Trash        | GET    | /api/document/trash/count     | Count trashed documents |
| Trash        | DELETE | /api/document/trash/empty     | Empty trash             |
| Trash        | PATCH  | /api/document/:id/soft-delete | Move to trash           |
| Trash        | PATCH  | /api/document/:id/restore     | Restore from trash      |
| Sharing      | PATCH  | /api/document/:id/editors     | Update editors          |
| Sharing      | PATCH  | /api/document/:id/public      | Toggle public access    |
| Clone        | POST   | /api/document/:id/clone       | Clone document          |
| Files        | POST   | /api/document/:id/images      | Upload images           |
| Files        | GET    | /api/document/:id/pdf         | Generate PDF            |
| Locking      | POST   | /api/document/:id/lock        | Lock document           |
| Locking      | POST   | /api/document/:id/unlock      | Unlock document         |
| Public       | GET    | /api/public/document/:id      | View public document    |
| Share        | POST   | /api/share/public-link/:id    | Create public link      |
| Presentation | POST   | /api/presentation             | Create presentation     |
| Presentation | GET    | /api/presentation             | List presentations      |
| Presentation | GET    | /api/presentation/:id         | Get presentation        |
| Presentation | PATCH  | /api/presentation/:id         | Update presentation     |
| Presentation | DELETE | /api/presentation/:id         | Delete presentation     |
| Presentation | GET    | /api/presentation/search      | Search presentations    |
| Presentation | POST   | /api/presentation/:id/lock    | Lock presentation       |
| Presentation | POST   | /api/presentation/:id/unlock  | Unlock presentation     |
