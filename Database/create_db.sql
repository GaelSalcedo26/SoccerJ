CREATE DATABASE Soccer;
GO

USE Soccer;
GO

CREATE TABLE League (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Country VARCHAR(50) NOT NULL,
	StartDate DATETIME NOT NULL DEFAULT GETDATE(),
	EndDate DATETIME NOT NULL DEFAULT GETDATE(),
	Enabled BIT NOT NULL DEFAULT 1,

	CONSTRAINT CHK_League_Name
		CHECK (Name LIKE '%[A-Za-zÁÉÍÓÚáéíóúÑñ]%[A-Za-zÁÉÍÓÚáéíóúÑñ]%'),
	CONSTRAINT CHK_League_Country
		CHECK (Country LIKE '%[A-Za-zÁÉÍÓÚáéíóúÑñ]%[A-Za-zÁÉÍÓÚáéíóúÑñ]%'),
	CONSTRAINT CHK_League_Dates
		CHECK (StartDate <= EndDate)
);
GO

CREATE TABLE Team (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Country VARCHAR(50) NOT NULL,
	PlayersQuantity INT NOT NULL CHECK (PlayersQuantity BETWEEN 11 AND 22),
	Enabled BIT NOT NULL DEFAULT 1,

	CONSTRAINT CHK_Team_Name
		CHECK (Name LIKE '%[A-Za-zÁÉÍÓÚáéíóúÑñ]%[A-Za-zÁÉÍÓÚáéíóúÑñ]%'),
	CONSTRAINT CHK_Team_Country
		CHECK (Country LIKE '%[A-Za-zÁÉÍÓÚáéíóúÑñ]%[A-Za-zÁÉÍÓÚáéíóúÑñ]%')
);
GO

CREATE TABLE League_Team (
	LeagueID INT NOT NULL,
	TEAMID INT NOT NULL,

	CONSTRAINT PK_League_Team
		PRIMARY KEY (LeagueID, TEAMID),

	CONSTRAINT FK_League_Team_League
		FOREIGN KEY (LeagueID) REFERENCES League(Id)
		ON DELETE CASCADE,

	CONSTRAINT FK_TEAMID_Team
		FOREIGN KEY (TEAMID) REFERENCES Team(Id)
		ON DELETE CASCADE
);
GO
