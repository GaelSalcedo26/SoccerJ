# Soccer

Web application to manage a catalog of soccer leagues and teams. Teams can be registered in different leagues, and leagues can have different teams.

## Data Base

This project contains a script called `create_db.sql` (inside the `Database` folder) to create the database and the tables needed for the correct functionality of the web app.

Run it in SQL Server Management Studio connected to `localhost\SQLEXPRESS`.

## Back-end

This project was generated using ASP.NET Core (.NET 10) with Entity Framework Core for more efficient database management using an ORM.

### Development server

To start a local development server, run:

```bash
cd Soccer.Api
dotnet run
```

The API will be available at `http://localhost:5011/`.

If your SQL Server instance has a different name, update the connection string in `Soccer.Api/appsettings.json`.

## Front-end

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

### Install dependencies

Before running the project for the first time, run:

```bash
cd soccer-web
npm install
```

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The back-end must be running at the same time.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

### Running unit tests

To execute unit tests with the Vitest test runner, use the following command:

```bash
ng test
```
