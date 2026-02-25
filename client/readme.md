```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant LockSrv as Locking Service
    participant DocSrv as Document Service

    %% OPEN EDIT PAGE
    Client->>DocSrv: Get document

    %% LOCK DOCUMENT
    Client->>LockSrv: Lock document
    LockSrv-->>Client: Lock OK

    %% USER EDITS
    Client->>Client: User edits title/content
    Client->>Client: User adds images

    %% SAVE DOCUMENT
    Client->>DocSrv: Upload images + Save document
    DocSrv-->>Client: Save OK

    %% UNLOCK DOCUMENT
    Client->>LockSrv: Unlock document
    LockSrv-->>Client: Unlock OK

    %% REDIRECT
    Client->>Client: Redirect to document view
```

```mermaid
sequenceDiagram
    autonumber
    participant Router as Express Router
    participant AuthMW as Auth Middleware
    participant Validator as Validation Middleware
    participant Controller as Document Controller
    participant Service as Document Service
    participant Mongo as MongoDB

    Router->>AuthMW: 1. Verify JWT
    AuthMW->>Validator: 2. Validate request body
    Validator->>Controller: 3. Forward valid request
    Controller->>Service: 4. Execute business logic
    Service->>Mongo: 5. Query / Update / Delete
    Mongo-->>Service: 6. Result
    Service-->>Controller: 7. Return processed data
    Controller-->>Router: 8. Send HTTP response
```


```mermaid
sequenceDiagram
    autonumber
    participant Client as ProfilePage (React)
    participant UserService as User Service (Axios)
    participant Router as Express Router
    participant AuthMW as Auth Middleware
    participant Controller as User Controller
    participant UserSrv as User Service (Server)
    participant Mongo as MongoDB

    %% FETCH PROFILE
    Client->>UserService: 1. getProfile()
    UserService->>Router: 2. GET /api/user/profile
    Router->>AuthMW: 3. Validate JWT
    AuthMW->>Controller: 4. Forward request
    Controller->>UserSrv: 5. Fetch user by ID
    UserSrv->>Mongo: 6. findById(userId)
    Mongo-->>UserSrv: 7. User document
    UserSrv-->>Controller: 8. User data
    Controller-->>Client: 9. 200 OK

    %% UPDATE PROFILE
    Client->>UserService: 10. updateProfile(data)
    UserService->>Router: 11. PUT /api/user/profile
    Router->>AuthMW: 12. Validate JWT
    AuthMW->>Controller: 13. Forward request
    Controller->>UserSrv: 14. Update user fields
    UserSrv->>Mongo: 15. updateOne({_id:userId}, {$set:data})
    Mongo-->>UserSrv: 16. Update result
    UserSrv-->>Controller: 17. Updated user
    Controller-->>Client: 18. 200 OK
```

```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant DocService as Document Service (Axios)
    participant Router as Express Router
    participant AuthMW as Auth Middleware
    participant Controller as Document Controller
    participant DocSrv as Document Service (Server)
    participant Mongo as MongoDB

    %% MOVE TO TRASH
    Client->>DocService: 1. moveToTrash(id)
    DocService->>Router: 2. PUT /api/documents/:id/trash
    Router->>AuthMW: 3. Validate JWT
    AuthMW->>Controller: 4. Forward request
    Controller->>DocSrv: 5. Set isTrashed = true
    DocSrv->>Mongo: 6. updateOne({_id:id}, {$set:{isTrashed:true}})
    Mongo-->>DocSrv: 7. Update result
    DocSrv-->>Controller: 8. Success
    Controller-->>Client: 9. 200 OK

    %% RESTORE FROM TRASH
    Client->>DocService: 10. restoreDocument(id)
    DocService->>Router: 11. PUT /api/documents/:id/restore
    Router->>AuthMW: 12. Validate JWT
    AuthMW->>Controller: 13. Forward request
    Controller->>DocSrv: 14. Set isTrashed = false
    DocSrv->>Mongo: 15. updateOne({_id:id}, {$set:{isTrashed:false}})
    Mongo-->>DocSrv: 16. Update result
    DocSrv-->>Controller: 17. Success
    Controller-->>Client: 18. 200 OK

    %% PERMANENT DELETE
    Client->>DocService: 19. deleteDocument(id)
    DocService->>Router: 20. DELETE /api/documents/:id
    Router->>AuthMW: 21. Validate JWT
    AuthMW->>Controller: 22. Forward request
    Controller->>DocSrv: 23. Delete document
    DocSrv->>Mongo: 24. deleteOne({_id:id})
    Mongo-->>DocSrv: 25. Delete result
    DocSrv-->>Controller: 26. Success
    Controller-->>Client: 27. 200 OK
```


```mermaid
flowchart LR
    subgraph Client["React Client (Browser)"]
        UI["Components / Pages"]
        AuthCtx["AuthProvider (token, user)"]
        Axios["Axios Services (CRUD)"]
        LocalStorage["localStorage (JWT)"]
        UI --> AuthCtx
        UI --> Axios
        AuthCtx --> LocalStorage
        Axios --> LocalStorage
    end

    subgraph Server["Node.js + Express API"]
        Router["Express Router"]
        AuthMW["Auth Middleware (JWT verify)"]
        Validator["Validation Middleware"]
        Controllers["Controllers"]
        Services["Business Logic Services"]
    end

    subgraph Database["MongoDB"]
        Users["Users Collection"]
        Docs["Documents Collection"]
        Presentations["Presentations Collection"]
    end

    %% Connections
    Axios -->|HTTP Requests| Router
    Router --> Validator
    Router --> AuthMW
    Router --> Controllers
    Controllers --> Services
    Services --> Users
    Services --> Docs
    Services --> Presentations
```


```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant DocService as Document Service (Axios)
    participant Router as Express Router
    participant AuthMW as Auth Middleware
    participant Controller as Document Controller
    participant DocServiceSrv as Document Service (Server)
    participant Mongo as MongoDB

    %% CREATE DOCUMENT
    Client->>DocService: 1. createDocument(data)
    DocService->>Router: 2. POST /api/documents
    Router->>AuthMW: 3. Validate JWT
    AuthMW->>Controller: 4. Forward request
    Controller->>DocServiceSrv: 5. Insert document
    DocServiceSrv->>Mongo: 6. insertOne()
    Mongo-->>DocServiceSrv: 7. Insert result
    DocServiceSrv-->>Controller: 8. Document created
    Controller-->>Client: 9. 201 Created

    %% READ DOCUMENTS
    Client->>DocService: 10. getDocuments()
    DocService->>Router: 11. GET /api/documents
    Router->>AuthMW: 12. Validate JWT
    AuthMW->>Controller: 13. Forward request
    Controller->>DocServiceSrv: 14. Fetch documents
    DocServiceSrv->>Mongo: 15. find({ userId })
    Mongo-->>DocServiceSrv: 16. Array of documents
    DocServiceSrv-->>Controller: 17. Documents
    Controller-->>Client: 18. 200 OK

    %% UPDATE DOCUMENT
    Client->>DocService: 19. updateDocument(id, data)
    DocService->>Router: 20. PUT /api/documents/:id
    Router->>AuthMW: 21. Validate JWT
    AuthMW->>Controller: 22. Forward request
    Controller->>DocServiceSrv: 23. Update document
    DocServiceSrv->>Mongo: 24. updateOne()
    Mongo-->>DocServiceSrv: 25. Update result
    DocServiceSrv-->>Controller: 26. Updated document
    Controller-->>Client: 27. 200 OK

    %% DELETE DOCUMENT
    Client->>DocService: 28. deleteDocument(id)
    DocService->>Router: 29. DELETE /api/documents/:id
    Router->>AuthMW: 30. Validate JWT
    AuthMW->>Controller: 31. Forward request
    Controller->>DocServiceSrv: 32. Delete document
    DocServiceSrv->>Mongo: 33. deleteOne()
    Mongo-->>DocServiceSrv: 34. Delete result
    DocServiceSrv-->>Controller: 35. Success
    Controller-->>Client: 36. 200 OK
```



```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant AuthService as Auth Service (Axios)
    participant Router as Express Router
    participant Validator as Validation Middleware
    participant Controller as Auth Controller
    participant UserService as User Service
    participant Mongo as MongoDB

    Client->>AuthService: 1. signup(email, username, password)
    AuthService->>Router: 2. POST /api/auth/signup

    Router->>Validator: 3. Validate request body
    alt Validation fails
        Validator-->>Client: 4. 400 Bad Request
    else Validation ok
        Router->>Controller: 5. Forward validated request
        Controller->>UserService: 6. Check if email exists
        UserService->>Mongo: 7. Query user by email
        Mongo-->>UserService: 8. User exists or null

        alt Email exists
            UserService-->>Client: 9. 409 Conflict (email must be unique)
        else Email free
            UserService->>UserService: 10. Hash password (bcrypt)
            UserService->>Mongo: 11. Insert new user
            Mongo-->>UserService: 12. Insert result
            UserService-->>Controller: 13. Success
            Controller-->>AuthService: 14. 201 Created
            AuthService-->>Client: 15. Resolve Promise
            Client->>Client: 16. Redirect to login
        end
    end
```



```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant AuthService as Auth Service (Axios)
    participant Router as Express Router
    participant Validator as Validation Middleware
    participant Controller as Auth Controller
    participant UserService as User Service
    participant Mongo as MongoDB

    Client->>AuthService: 1. login(email, password)
    AuthService->>Router: 2. POST /api/auth/login

    Router->>Validator: 3. Validate request body
    alt Validation fails
        Validator-->>Client: 4. 400 Bad Request (invalid format)
    else Validation ok
        Router->>Controller: 5. Forward validated request
        Controller->>UserService: 6. Check credentials
        UserService->>Mongo: 7. Query user by email
        Mongo-->>UserService: 8. User document

        alt Password matches
            UserService->>UserService: 9. Create JWT token (1h)
            UserService-->>Controller: 10. {token, user}
            Controller-->>AuthService: 11. 200 OK
            AuthService-->>Client: 12. Resolve Promise
            Client->>Client: 13. Store token in localStorage
            Client->>Client: 14. Redirect to "/"
        else Password invalid
            UserService-->>Controller: 9. null
            Controller-->>Client: 10. 401 Unauthorized
        end
    end

```


```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client (Browser)
    participant AuthService as Auth Service (Axios)
    participant Server as Express API
    participant Mongo as MongoDB

    Client->>AuthService: login(email, password)
    AuthService->>Server: POST /api/auth/login {email, password}

    Server->>Mongo: Query users collection
    Mongo-->>Server: User document (or null)

    alt Valid credentials
        Server-->>AuthService: 200 OK {token, user}
        AuthService-->>Client: Resolve Promise
        Client->>Client: Store token in AuthProvider
        Client->>Client: Redirect to "/"
    else Invalid credentials
        Server-->>AuthService: 401 Unauthorized
        AuthService-->>Client: Reject Promise
        Client->>Client: Show toast "Invalid credentials"
    end
```
## improved localstorage added

```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client
    participant AuthService as Auth Service (Axios)
    participant Server as Express API
    participant Mongo as MongoDB

    Client->>AuthService: 1. login(email, password)
    AuthService->>Server: 2. POST /api/auth/login {email, password}

    Server->>Mongo: 3. Validate credentials
    Mongo-->>Server: 4. User document

    alt Valid credentials
        Server-->>AuthService: 5. 200 OK {token, user}
        AuthService-->>Client: 6. Resolve Promise
        Client->>Client: 7. Store token in localStorage
        Client->>Client: 8. Update AuthProvider state
        Client->>Client: 9. Redirect to "/"
    else Invalid credentials
        Server-->>AuthService: 5. 401 Unauthorized
        AuthService-->>Client: 6. Reject Promise
        Client->>Client: 7. Show error toast
    end
```


```mermaid
sequenceDiagram
    autonumber
    participant Client as React Component
    participant DocService as Document Service (Axios)
    participant Server as Express API
    participant Mongo as MongoDB

    Client->>DocService: getDocuments()
    DocService->>Server: GET /api/documents (Authorization: Bearer TOKEN)

    Server->>Mongo: Find documents where userId = TOKEN.userId
    Mongo-->>Server: Array of documents

    Server-->>DocService: 200 OK [documents]
    DocService-->>Client: Return data
    Client->>Client: Render documents list
```



STRUCTURE
tähän sijainnit hakemistossa ja riipppuvuus suhteet mermaid?
COPILOT "The Client‑Side UI Stack"

presentation can be swipe right left like a carousel implement


https://laakktidev.github.io/LUT_AWA_Project_Work/server/docs/
https://laakktidev.github.io/LUT_AWA_Project_Work/client/docs/

learn to express me an work in english pretty much  better
Because not natural born english speakinn person.English grammatic and formation from rally englisht to sophistics english
Test, example and demo data generation.
I have spent great moment but less great as well with copilot. The problems and misunderstandig mislea dcause dmostyly I think free tier.
Like Pekkis has said need practise also with AI as least free tier version need exprience and at least basic understanding the topic in focus.
think I have learned from ai and ai, so this kind of project implement time could be much shorter
Mainitse myös usein menee paljon aikaa UI-suunnitteluun ja toteutukseen, joten AI:n hyödyntäminen UI-koodin nopeuttamisessa on ollut merkittävä ajansäästötekijä. AI on auttanut luomaan nopeasti käyttöliittymän perusrakenteen ja tyylit, mikä on vapauttanut aikaa keskittyä enemmän sovelluksenlogiikkaan ja ominaisuuksiin.
Normally UI design takes a lot of time, so 
copilot is pretty good on that, previosly used Bootstrap now MUI first time, copilot teached me with this UI library new for me.
MYös auttanut Typesciptin kannsa
# Declaration of AI Usage

## 1. AI Systems Used

The following AI systems were used during the development of this assignment:

- **GitHub Copilot** (VS Code integration)
- **ChatGPT (OpenAI)**
- **Google Translate**

---

## 2. How and Where AI Was Used

AI tools were used as supportive development assistants during different phases of the project. Their role was that of a *technical assistant*, not an autonomous developer.

### a) Code Assistance and Refactoring

GitHub Copilot was used to:

- Generate boilerplate code and routine implementations  
- Suggest refactoring improvements  
- Provide alternative implementations and modern ES6+ syntax  
- Assist in converting older coding patterns into modern ECMAScript standards  
- Generate basic unit tests (which were then reviewed and validated manually)  
- Suggest naming conventions for variables, functions, and components  
- Help structure code when the application grew larger and more complex  

All generated code was manually reviewed, tested, and modified when necessary.  
Code that was not fully understood was not accepted into the final implementation.

---

### b) UI Development (Material UI – MUI)

Material UI (MUI) was new to the author. AI assistance was used to:

- Learn component usage and patterns  
- Speed up UI layout creation  
- Reduce time spent on styling and repetitive UI tasks  
- Resolve UI-related error messages  

AI significantly reduced time consumption in UI implementation, which is typically one of the most time-intensive parts of development.

---

### c) Architecture and Best Practices

AI was consulted for:

- Architectural suggestions  
- Context-based state management (e.g., global token/user handling)  
- Best practice discussions  
- Error handling strategies  
- TypeScript strict mode issues  
- Interpretation of error messages  

All architectural decisions were ultimately made by the author, based on prior MERN-stack experience and earlier studies (e.g., FullStackOpen and other courses).

---

### d) Documentation and Language Support

AI tools (ChatGPT and Google Translate) were used to:

- Improve English language quality  
- Proofread and refine text  
- Format documentation professionally  
- Assist in writing JSDoc/TSDoc comments  
- Improve clarity and structure of explanations  

The core content and technical understanding were produced by the author, while AI helped improve linguistic quality.

---

### e) Learning and Knowledge Refresh

AI was used to:

- Refresh previous MERN-stack knowledge  
- Explore updated JavaScript/TypeScript features  
- Discuss alternative approaches  
- Compare implementation options  

The author has previous experience in MERN-stack development.  
AI acted as an interactive sparring partner to explore ideas, not as a replacement for foundational knowledge.

---

## 3. Critical Reflection on AI Usage

AI proved to be:

- A productive assistant for repetitive tasks  
- Helpful in accelerating UI work  
- Useful for refactoring and syntax modernization  
- Valuable for documentation and English writing  

However, AI occasionally:

- Produced hallucinated or incorrect code  
- Suggested non-optimal practices  
- Generated solutions requiring careful validation  

Therefore, continuous critical evaluation was necessary. Effective use of AI required:

- Prior technical knowledge  
- Ability to interpret suggestions  
- Testing and validation of all generated outputs  
- Careful step-by-step prompting  

AI was treated as “a good servant but a bad master” — a tool that enhances productivity when supervised, but unreliable if used without understanding.

---

## 4. Statement of Responsibility

All final decisions, architecture choices, and code integrations were made by the author.  
No code was accepted without understanding its functionality.  
All features were manually tested and verified.

AI assistance supported productivity and learning, but responsibility for correctness, design, and implementation remains entirely with the author.




| Done | Points | Feature |
|------|---------|---------|
| [x] | [25] | Basic features with documentation |
| [x] | [3] | Frontside framework (React/Angular/Vue) |
| [x] | [2] | WYSIWYG editor |
| [x] | [3] | PDF download |
| [x] | [1] | Creation + updated timestamps |
| [x] | [1] | Sorting documents |
| [x] | [2] | Profile picture upload |
| [ ] | [ ] | Commenting parts of document |
| [ ] | [ ] | Spreadsheets (SUM + cells) |
| [x] | [3] | Presentation slides |
| [ ] | [ ] | Folder hierarchy |
| [x] | [1] | Dark/bright modes |
| [x] | [2] | Recycle bin |
| [x] | [1] | Clone document |
| [x] | [2] | Upload images |
| [x] | [2] | UI translation |
| [ ] | [ ] | Multi‑user editing |
| [x] | [4] | Unit + automated tests |
| [x] | [2] | Search functionality |
| [x] | [2] | Pagination |
| [x] | [1] | Send public document link via email |  
| [x] | [1] | Handling token expiration in every route |  

58 points total

**TESTS** 
#### Server
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
npx ts-jest config:init
->
jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
};

#### Client
npm install --save-dev cypress
