# Test Suite Results

A structured breakdown of all test suites, each with a short description explaining what the tests verify.

## Document Trash Routes

Tests soft‑delete, restore, listing, and permanent deletion behavior.

File: `tests/integration/documentTrashRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|PATCH /api/document/:id/soft-delete|moves document to trash|✓|16 ms|
|GET /api/document/trash|returns deleted documents|✓|18 ms|
|GET /api/document/trash/count|returns number of deleted documents|✓|16 ms|
|PATCH /api/document/:id/restore|restores a deleted document|✓|13 ms|
|DELETE /api/document/trash/empty|permanently deletes all trashed docs|✓|14 ms|

## User Routes

Tests registration, login, listing users, and uploading profile pictures.

File: `tests/integration/userRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|POST /api/user/register|registers a new user|✓|59 ms|
|POST /api/user/login|logs in a user|✓|103 ms|
|GET /api/user/|returns list of users|✓|112 ms|
|POST /api/user/profile-picture|uploads a profile image|✓|111 ms|

## Document File Routes

Tests uploading images and generating PDFs.

File: `tests/integration/documentFileRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|POST /api/document/:id/images|uploads an image|✓|12 ms|
|GET /api/document/:id/pdf|generates a PDF|✓|22 ms|
|GET /api/document/:id/pdf|denies access to non-owner|✓|111 ms|

## Document Sharing Routes

Tests updating editors and public visibility.

File: `tests/integration/documentShareRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|PATCH /api/document/:id/editors|updates editors list|✓|63 ms|
|PATCH /api/document/:id/public|updates public visibility|✓|11 ms|

## Document Search Route

Tests search functionality and filtering of deleted documents.

File: `tests/integration/documentSearchRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|GET /api/document/search|finds documents by title|✓|8 ms|
|GET /api/document/search|finds documents by content|✓|13 ms|
|GET /api/document/search|excludes deleted documents|✓|7 ms|
|GET /api/document/search|returns empty array when no matches|✓|5 ms|

## Document Routes

Tests core CRUD operations.

File: `tests/integration/documentRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|POST /api/document|creates a new document|✓|5 ms|
|GET /api/document|returns user's documents|✓|10 ms|
|GET /api/document/:id|returns a single document|✓|9 ms|
|PUT /api/document/:id|updates a document|✓|11 ms|
|DELETE /api/document/:id|deletes a document|✓|10 ms|

## Document Clone Route

Tests duplicating a document.

File: `tests/integration/documentCloneRoutes.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|POST /api/document/:id/clone|clones a document|✓|11 ms|

# Unit Test Results

## userAuthService

Tests user creation, password validation, and JWT generation.

File: `tests/unit/userAuthService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|registerUserInDb|creates a new user|✓|49 ms|
|findUserByEmail|returns correct user|✓|4 ms|
|validatePassword (correct)|returns true for correct password|✓|96 ms|
|validatePassword (incorrect)|returns false for wrong password|✓|98 ms|
|createJwtToken|returns a valid JWT|✓|1 ms|

## documentSearchService

Tests searching and filtering logic.

File: `tests/unit/documentSearchService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|finds documents by title|matches title|✓|15 ms|
|finds documents by content|matches content|✓|3 ms|
|is case-insensitive|ignores letter case|✓|2 ms|
|returns only user's documents|filters by owner|✓|5 ms|
|excludes deleted documents|filters out deleted docs|✓|4 ms|

## documentService

Tests core document operations.

File: `tests/unit/documentService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|createDocumentInDb|creates a new document|✓|12 ms|
|getDocumentById|returns correct document|✓|2 ms|
|updateDocumentById|updates fields|✓|3 ms|
|deleteDocumentById|removes document|✓|3 ms|
|getAllDocumentsForUser|returns only user's documents|✓|5 ms|

## documentCloneService

Tests cloning logic.

File: `tests/unit/documentCloneService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|cloneDocumentInDb|copies content into new document|✓|14 ms|

## documentLockService

Tests locking and unlocking.

File: `tests/unit/documentLockService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|lockDocumentInDb|sets lock.isLocked and lockedBy|✓|15 ms|
|unlockDocumentInDb|clears lock|✓|4 ms|

## documentTrashService

Tests soft‑delete, restore, and permanent deletion.

File: `tests/unit/documentTrashService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|softDeleteDocumentById|marks document as deleted|✓|12 ms|
|restoreDocumentById|restores a document|✓|3 ms|
|permanentlyDeleteDocumentById|removes the document permanently|✓|3 ms|
|getTrashDocuments|returns only deleted documents|✓|5 ms|

## documentShareService

Tests sharing rules and editor/public updates.

File: `tests/unit/documentShareService.test.ts`

|Test|Description|Status|Time|
|---|---|---|---|
|getDocumentForSharing|returns document only for owner|✓|14 ms|
|addEditorsToDocument|adds editors without duplicates|✓|2 ms|
|updatePublicVisibilityInDb|updates visibility for owner only|✓|3 ms|

# Final Summary

Code

```
Test Suites: 14 passed, 14 total
Tests:       49 passed, 49 total
Snapshots:   0 total
Time:        5.05 s
```