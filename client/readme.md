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
| [ ] | [3] | **Presentation slides** |
| [ ] | [ ] | Folder hierarchy |
| [x] | [1] | Dark/bright modes |
| [x] | [2] | Recycle bin |
| [x] | [1] | Clone document |
| [x] | [2] | Upload images |
| [ ] | [ ] | **UI translation** |
| [ ] | [ ] | Multi‑user editing |
| [ ] | [ ] | **Unit + automated tests** |
| [x] | [2] | Search functionality |
| [x] | [2] | Pagination |

| [] | [] | **Send public document link via email** |  


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
