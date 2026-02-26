## Test Suite Results

Below is a structured breakdown of all test suites and their results.

### Document Trash Routes

File: `tests/integration/documentTrashRoutes.test.ts`

| Test                                                                       | Status | Time  |
| -------------------------------------------------------------------------- | ------ | ----- |
| PATCH /api/document/:id/soft-delete moves document to trash                | ✓      | 16 ms |
| GET /api/document/trash returns deleted documents                          | ✓      | 18 ms |
| GET /api/document/trash/count returns number of deleted documents          | ✓      | 16 ms |
| PATCH /api/document/:id/restore restores a deleted document                | ✓      | 13 ms |
| DELETE /api/document/trash/empty permanently deletes all trashed documents | ✓      | 14 ms |

### User Routes

File: `tests/integration/userRoutes.test.ts`

```
POST /api/user/register 201
POST /api/user/login 200
GET /api/user/ 200
POST /api/user/profile-picture 200
```

| Test                                                    | Status | Time   |
| ------------------------------------------------------- | ------ | ------ |
| POST /api/user/register registers a new user            | ✓      | 59 ms  |
| POST /api/user/login logs in a user                     | ✓      | 103 ms |
| GET /api/user/ returns list of users when authenticated | ✓      | 112 ms |
| POST /api/user/profile-picture uploads an image         | ✓      | 111 ms |

### Document File Routes

File: `tests/integration/documentFileRoutes.test.ts`

| Test                                                 | Status | Time   |
| ---------------------------------------------------- | ------ | ------ |
| POST /api/document/:id/images uploads an image       | ✓      | 12 ms  |
| GET /api/document/:id/pdf generates a PDF            | ✓      | 22 ms  |
| GET /api/document/:id/pdf denies access to non-owner | ✓      | 111 ms |

### Document Sharing Routes

File: `tests/integration/documentShareRoutes.test.ts`

| Test                                                     | Status | Time  |
| -------------------------------------------------------- | ------ | ----- |
| PATCH /api/document/:id/editors updates editors list     | ✓      | 63 ms |
| PATCH /api/document/:id/public updates public visibility | ✓      | 11 ms |

### Document Search Route

File: `tests/integration/documentSearchRoutes.test.ts`

| Test                                                         | Status | Time  |
| ------------------------------------------------------------ | ------ | ----- |
| GET /api/document/search finds documents by title            | ✓      | 8 ms  |
| GET /api/document/search finds documents by content          | ✓      | 13 ms |
| GET /api/document/search does not return deleted documents   | ✓      | 7 ms  |
| GET /api/document/search returns empty array when no matches | ✓      | 5 ms  |

### Document Routes

File: `tests/integration/documentRoutes.test.ts`

| Test                                            | Status | Time  |
| ----------------------------------------------- | ------ | ----- |
| POST /api/document creates a new document       | ✓      | 5 ms  |
| GET /api/document returns user's documents      | ✓      | 10 ms |
| GET /api/document/:id returns a single document | ✓      | 9 ms  |
| PUT /api/document/:id updates a document        | ✓      | 11 ms |
| DELETE /api/document/:id deletes a document     | ✓      | 10 ms |

### Document Clone Route

File: `tests/integration/documentCloneRoutes.test.ts`

| Test                                           | Status | Time  |
| ---------------------------------------------- | ------ | ----- |
| POST /api/document/:id/clone clones a document | ✓      | 11 ms |

## Unit Test Results

### userAuthService

File: `tests/unit/userAuthService.test.ts`

| Test                                                  | Status | Time  |
| ----------------------------------------------------- | ------ | ----- |
| registerUserInDb creates a new user                   | ✓      | 49 ms |
| findUserByEmail returns correct user                  | ✓      | 4 ms  |
| validatePassword returns true for correct password    | ✓      | 96 ms |
| validatePassword returns false for incorrect password | ✓      | 98 ms |
| createJwtToken returns a valid JWT                    | ✓      | 1 ms  |

### documentSearchService

File: `tests/unit/documentSearchService.test.ts`

| Test                          | Status | Time  |
| ----------------------------- | ------ | ----- |
| finds documents by title      | ✓      | 15 ms |
| finds documents by content    | ✓      | 3 ms  |
| is case-insensitive           | ✓      | 2 ms  |
| returns only user's documents | ✓      | 5 ms  |
| excludes deleted documents    | ✓      | 4 ms  |

### documentService

File: `tests/unit/documentService.test.ts`

| Test                                                 | Status | Time  |
| ---------------------------------------------------- | ------ | ----- |
| createDocumentInDb creates a new document            | ✓      | 12 ms |
| getDocumentById returns correct document             | ✓      | 2 ms  |
| updateDocumentById updates fields                    | ✓      | 3 ms  |
| deleteDocumentById removes document                  | ✓      | 3 ms  |
| getAllDocumentsForUser returns only user's documents | ✓      | 5 ms  |

### documentCloneService

File: `tests/unit/documentCloneService.test.ts`

| Test                                                         | Status | Time  |
| ------------------------------------------------------------ | ------ | ----- |
| cloneDocumentInDb creates a new document with copied content | ✓      | 14 ms |

### documentLockService

File: `tests/unit/documentLockService.test.ts`

| Test                                             | Status | Time  |
| ------------------------------------------------ | ------ | ----- |
| lockDocumentInDb sets lock.isLocked and lockedBy | ✓      | 15 ms |
| unlockDocumentInDb clears lock                   | ✓      | 4 ms  |

### documentTrashService

File: `tests/unit/documentTrashService.test.ts`

| Test                                               | Status | Time  |
| -------------------------------------------------- | ------ | ----- |
| softDeleteDocumentById marks document as deleted   | ✓      | 12 ms |
| restoreDocumentById restores a document            | ✓      | 3 ms  |
| permanentlyDeleteDocumentById removes the document | ✓      | 3 ms  |
| getTrashDocuments returns only deleted documents   | ✓      | 5 ms  |

### documentShareService

File: `tests/unit/documentShareService.test.ts`

| Test                                                         | Status | Time  |
| ------------------------------------------------------------ | ------ | ----- |
| getDocumentForSharing returns document only if user is owner | ✓      | 14 ms |
| addEditorsToDocument adds editors without duplicates         | ✓      | 2 ms  |
| updatePublicVisibilityInDb updates visibility only for owner | ✓      | 3 ms  |

## Final Summary

```
Test Suites: 14 passed, 14 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        5.05 s
```