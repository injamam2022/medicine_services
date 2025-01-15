# Steps to install project
User can buy and sell their project online

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`APP_PORT`

`DB_USERNAME`

`DB_PASSWORD`

`DB_NAME`

`DB_HOST`

`DB_PORT`

`JWT_SECRET_KEY`

`JWT_EXPIRES_IN`

`ADMIN_EMAIL`

`ADMIN_PASSWORD`


## Installation

Install my-project with npm

```bash
  npm run install
  npm run migrate
  npm run seed:all
  npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
  npx sequelize-cli seed:generate --name demo-user
```
    
## Authors
Injamamul & Arnab


## 🚀 About Me
I'm a full stack developer...

