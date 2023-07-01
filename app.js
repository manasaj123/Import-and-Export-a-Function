const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const databasePath = path.join(__dirname, "moviesDate.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertMovieNametoPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

//1 
app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
SELECT
movie_name
FROM
movie;`;
  const moviesArray = await db.all(getAllMoviesQuery);
    response.send(
      moviesArray.map((noviename) => convertMovieNametoPascalCase(moviename))
    );
});

//2
app.post("movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
INSERT INTO
movie ( director_id, movie_name, lead_actor)
VALUES
(
${directorId}, 
'${movieName}', 
'${leadActor}');`;

 const dbResponse = await db.run(addMovieQuery);
 //console.log(dbResponse);
  response.send("Movie Successfully Added");
});
// to convert to pasalcase
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//3 Returns a movie 
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } request.params;
  const getMovieQuery = `
SELECT 
* 
FROM 
movie 
WHERE 
movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  console.log(movieId);
  response.send(convertDbObjectToResponseObject(movie));
});

//4 Updates the details
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
UPDATE
movie
SET
director_id = ${directorId},
movie_name = '${movieName}',
lead_actor = '${leadActor}'
WHERE
movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//5 Deletes a movie

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
DELETE FROM
movie
WHERE
movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

const convertDirectorDetailsPascalCase = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

//6 Returns a list
app.get("/directors/", async (request, response) => {
  const getAllDirectorsQuery = `
SELECT
*
FROM
director;`;
  const moviesArray = await db.all(getAllDirectorsQuery);
  response.send(
    moviesArray.map((director) => convertDirectorDetailsPascalCase(director))
  );
});

const convertMovieNamePascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

//7 Returns a list of all movie
app.get("/directors/:directorId/movie/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
SELECT
movie_name
FROM
director INNER JOIN movie
ON director.director_id = movie.director_id
WHERE
director.director_id= ${directorId};`;
  const movies = await db.all(getDirectorMoviesQuery);
  console.log(directorId);
  response.send(
    movies.map((movienames) => convertMovieNamePascalCase(movienames))
  );
});

module.exports = app;
