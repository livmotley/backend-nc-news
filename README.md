# NC News Seeding
Hosted Version can be found here: https://backend-nc-news-xms8.onrender.com/api

The Project:
- This is a Backend development project in which an API is built that can access a database of articles, topics, users and comments (mimicing a backend service of the likes of Reddit).
- This API will be built on to develop the Front End architecture

Setup Instructions:
1. Install Dev Dependencies:
- Jest, to run the test suite: `npm install -D jest` https://jestjs.io/
- Jest Sorted, to check for sort and order options in testing: `npm install -D jest-sorted` https://www.npmjs.com/package/jest-sorted
- Nodemon, for efficiency when working in Node.js: `npm install -D nodemon` https://www.npmjs.com/package/nodemon
- Supertest, for testing HTTP: `npm install supertest -D` https://www.npmjs.com/package/supertest

2. Install Non-Dev Dependencies:
- pg: `npm install pg` https://www.npmjs.com/package/pg
- pg-format: `npm install pg-format` https://www.npmjs.com/package/pg-format
- Express: `npm install express --save` https://expressjs.com/
- Dotenv: `npm install dotenv --save` https://www.npmjs.com/package/dotenv

3. Seed the Databases:
- Run `npm run setup-dbs` in the terminal
- Run `npm run seed-dev` in the terminal. Here you should see a console.log `Connected to nc_news`.
- Run `npm test` in the terminal to check that the test files are correctly connected to the test data. Here you should see a console.log `Connected to nc_news_test`

4. Create .env files:
- Create a .env.test file containing the code: PGDATABASE=nc_news_test
- Create a .env.development file containing the code: PGDATABASE=nc_news
- Check these files are within the .gitignore file

5. Check Node.js and Postgres Versions:
- Run `node --version` to see the current version of Node.js. Must be minimum v23.5.0 to run this repo
- Run `postgres --version` to see the current version of Postgres. Must be minimum 14.15 (Homebrew)

6. Running Tests:
- To run all tests: `npm test`
- To run specific test files `npm test <testFilePath>`