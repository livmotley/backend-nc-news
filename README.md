# NC News Seeding
Hosted Version can be found here: https://backend-nc-news-xms8.onrender.com/api

The Project:
- This is a Backend development project in which an API is built that can access a database of articles, topics, users and comments (mimicing a backend service of the likes of Reddit).
- This API will be built on to develop the Front End architecture

Setup Instructions:
1. Check Node.js and Postgres Versions:
- Run `node --version` to see the current version of Node.js. Must be minimum v23.5.0 to run this repo
- Run `postgres --version` to see the current version of Postgres. Must be minimum 14.15 (Homebrew)

2. Install Dependencies:
- Run `npm i` to install all dependencies

3. Create .env files:
- Create a .env.test file containing the code: PGDATABASE=nc_news_test
- Create a .env.development file containing the code: PGDATABASE=nc_news
- Check these files are within the .gitignore file

4. Seed the Databases:
- Run `npm run setup-dbs` in the terminal
- Run `npm run seed-dev` in the terminal. Here you should see a console.log `Connected to nc_news`.
- Run `npm test` in the terminal to check that the test files are correctly connected to the test data. Here you should see a console.log `Connected to nc_news_test`

5. Running Tests:
- To run all tests: `npm test`
- To run specific test files `npm test <testFilePath>`