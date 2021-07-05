# KanBan Board

## Project structure:

- DataBase: PostgreSQL
- Services: GraphQL / Apollo
- UI: React / TypeScript / React Router / Redux / MaterialUI / React Beautiful dnd
- UX-approach: Playful / StressFree / Minimal

## Set up:

### 1. Backend

Download Postgres DB. <https://www.postgresql.org/download/> You can find a guide here. <https://www.postgresqltutorial.com/install-postgresql/>

- Open your pgAdmin, Enter your password.
- From the pgAdmin Dashboard click on `Add New Server`.
- General Tab: Give a name to the new server. `exampleServerName`
- Connection Tab:
  1)Host name/address -> localhost
  2)Port -> `5432` this is the default port, it may be differ if you changed it.
  3)Maintenace database -> `exampleDatabaseName`
  4)Username -> `yourUserName`
  5)Password -> `yourPassword`
- Press the Save Button.
- Navigate to the `<applicationRoot>/server` directory.
- Open `sample.env` file and copy the content.
- Create `.env` file, paste the content.
- Replace the `examples` with your values at section Bullet 4 "Connection Tab".
- Install the server dependencies by navigating to `<applicationRoot>/server` and type `yarn` enter.
- Start the server with the command `yarn start` at the same directory.

#### Sample.env:

```
DB_HOST=localhost:`5432`
DB_NAME=`exampleDatabaseName`
DB_USER=`yourUserName`
DB_PASSWORD=`yourPassword`
```

### 2. Frontend

- Open a second terminal and navigate to the `<applicationRoot>` directory.
- Install the FE dependencies by navigating to `<applicationRoot>` and type `yarn` enter.
- Start the server with the command `yarn start` at the same directory.

---

## Description:

This project is just for demo purpose. This is not a bug free app, although some basic functionality is delivered.

- Creating boards.
- Creating / deleting / renaming and changing order of Status Columns
- Adding / moving tickets to / between status columns. Giving a description to a ticket and shown as a tooltip.
- Opening the ticket to a new page for more details and editing options.
- Discard a ticket / board
- Quick Access Menu for navigating to Home page / to Any created board and a quick action of creating a new board. These functionalities are accessible from any page of the app.

## Future Improvements:

- Database at this point is stored locally, which restricts the application users into just one and not having the ability of different users to use the same boards/tickets. A solution to this is to store the data in a cloud server (AWS).
- Services which retrieve the data from the db and providing them to Front End are in a direct communication with the db without any common structure and the usage of the correct API call status.
- UI uses redux-toolkid which a set of default functionality is provided. For having a more controlled redux state a solution is the redux-saga library which splits the redux into actions / sagas / reducers.
- Unit tests and integration tests, although are vital to the quality of the app were not perform due to the limited time frame.
- In addition a good practice for FE would be to use full functional programming coding to avoid any object mutation and avoid undesired side effects.
- Material UI gives the ability to create custom themes to their components. As for now the default set of theme was used.
- It would be nice to wrap the app with an SSO for Authorization / Authentication. A solution for this is Keycloak.
- After implementing an SSO the Kanban board will be able also to have different reporters and assignees.
- Also a good feature will be the user to have the ability to choose the between the structure of the Kanban between a board and a timeline. A good candidate library is react-calendar-timeline. Modifications should also take place to the BE in order of the above to be accomplished, like storing the estimation-time, pickup-time, delivered-time.
