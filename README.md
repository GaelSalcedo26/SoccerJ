# Soccer

Aplicación para administrar un catálogo de ligas y equipos de fútbol. Permite registrar, editar y eliminar ligas y equipos, e inscribir equipos en una o varias ligas (relación muchos a muchos).

El proyecto está dividido en tres partes:

- **Database**: script de SQL Server para crear la base de datos.
- **Soccer.Api**: API REST hecha en ASP.NET Core (.NET 10) con Entity Framework Core.
- **soccer-web**: frontend hecho en Angular 22.

## Requisitos

- SQL Server 2022 (se usó la edición Express) y SQL Server Management Studio
- .NET SDK 10
- Node.js 26 y npm
- Angular CLI 22 (`npm install -g @angular/cli`)

## Reglas del negocio

Estas reglas se validan en la base de datos, en la API y en los formularios del frontend:

- Un equipo debe tener entre 11 y 22 jugadores.
- En una liga, la fecha de inicio no puede ser posterior a la fecha de fin.
- El nombre y el país de ligas y equipos deben tener al menos 2 letras.
- Ningún campo acepta valores nulos.
- `Enabled` vale 1 por defecto y las fechas de la liga toman la fecha actual por defecto.
- Un equipo no se puede inscribir dos veces en la misma liga.
- Al eliminar una liga o un equipo se eliminan también sus inscripciones.

## Base de datos

Tablas:

| Tabla | Descripción |
|---|---|
| `League` | Ligas: nombre, país, fecha de inicio, fecha de fin y si está habilitada |
| `Team` | Equipos: nombre, país, cantidad de jugadores y si está habilitado |
| `League_Team` | Tabla intermedia entre ligas y equipos (clave primaria compuesta) |

Para crearla:

1. Abrir SQL Server Management Studio y conectarse a `localhost\SQLEXPRESS` con autenticación de Windows.
2. Abrir el archivo `Database/create_db.sql` y ejecutarlo.

## API

### Configuración

La cadena de conexión está en `Soccer.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "Soccer": "Server=localhost\\SQLEXPRESS;Database=Soccer;Trusted_Connection=True;TrustServerCertificate=true"
}
```

Si la instancia de SQL Server tiene otro nombre, hay que cambiarla ahí.

### Ejecutar

```
cd Soccer.Api
dotnet run
```

La API queda disponible en `http://localhost:5011`. Tiene CORS habilitado para `http://localhost:4200`, que es donde corre el frontend.

### Endpoints

**Equipos**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/team` | Lista todos los equipos |
| GET | `/api/team/{id}` | Obtiene un equipo |
| POST | `/api/team` | Crea un equipo |
| PUT | `/api/team/{id}` | Edita un equipo |
| DELETE | `/api/team/{id}` | Elimina un equipo |
| GET | `/api/team/{id}/leagues` | Ligas en las que está inscrito el equipo |

**Ligas**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/league` | Lista todas las ligas |
| GET | `/api/league/{id}` | Obtiene una liga |
| POST | `/api/league` | Crea una liga |
| PUT | `/api/league/{id}` | Edita una liga |
| DELETE | `/api/league/{id}` | Elimina una liga |
| GET | `/api/league/{id}/teams` | Equipos inscritos en la liga |

**Inscripciones**

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/leagueteam/{leagueId}/{teamId}` | Inscribe un equipo en una liga |
| DELETE | `/api/leagueteam/{leagueId}/{teamId}` | Retira un equipo de una liga |

Ejemplo para crear un equipo:

```json
POST /api/team
{
  "name": "Club América",
  "country": "México",
  "playersQuantity": 18,
  "enabled": true
}
```

Respuestas:

- `200 OK` / `201 Created` / `204 No Content` cuando la operación es correcta.
- `400 Bad Request` cuando no se cumple alguna regla (por ejemplo, 5 jugadores o fechas invertidas). La respuesta incluye el mensaje de cada campo.
- `404 Not Found` cuando la liga o el equipo no existe.
- `409 Conflict` cuando se intenta inscribir un equipo que ya está en la liga.

El archivo `Soccer.Api/Soccer.Api.http` sirve para probar las peticiones desde VS Code.

## Frontend

### Instalar dependencias (solo la primera vez)

```
cd soccer-web
npm install
```

### Ejecutar

```
ng serve
```

Abrir `http://localhost:4200`. La API debe estar corriendo al mismo tiempo.

### Pantallas

- **Equipos**: formulario para registrar o editar equipos y tabla con los equipos registrados.
- **Ligas**: formulario para registrar o editar ligas y tabla con las ligas registradas. Desde la tabla se entra al detalle de cada liga con el botón *Equipos*.
- **Detalle de liga**: muestra los equipos inscritos en la liga, permite inscribir equipos nuevos y retirar los que ya están.

## Estructura

```
MiSoccer/
├── Database/
│   └── create_db.sql
├── Soccer.Api/
│   ├── Controllers/      TeamController, LeagueController, LeagueTeamController
│   ├── Data/             SoccerDbContext (mapeo de las tablas)
│   ├── Models/           League, Team, LeagueTeam
│   ├── Program.cs        Configuración de EF Core y CORS
│   └── appsettings.json  Cadena de conexión
└── soccer-web/
    └── src/
        ├── styles.css    Estilos generales
        └── app/
            ├── models/   Interfaces League y Team
            ├── services/ Llamadas a la API
            └── pages/    teams, leagues, league-detail
```

## Orden para levantar el proyecto

1. Ejecutar `Database/create_db.sql` en SQL Server.
2. Correr la API con `dotnet run` dentro de `Soccer.Api`.
3. Correr el frontend con `ng serve` dentro de `soccer-web`.
4. Entrar a `http://localhost:4200`.
