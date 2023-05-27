const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const q = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () =>
      console.log("Server Running at http://localhost:3009/")
    );
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
q();
const a = (oObject) => {
  return {
    playerId: oObject.player_id,
    playerName: oObject.player_name,
    jerseyNumber: oObject.jersey_number,
    role: oObject.role,
  };
};
app.get("/players/", async (request, response) => {
  const player = `select * from cricket_team;`;
  const play = await db.all(player);
  response.send(play.map((eachPlayer) => a(eachPlayer)));
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const player_o = `select * from cricket_team WHERE player_id=${playerId};`;
  response.send(a(await db.get(player_o)));
});
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const addPlayerQuery = `
    INSERT INTO
    cricket_team(player_name,jersey_number,role)
    VALUES
    (
    "${playerName}",${jerseyNumber},"${role}");`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});
app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const yy = `
   UPDATE
      cricket_team
   SET
     player_name="${player_name}", 
     jersey_number=${jersey_number},
     role="${role}"
   WHERE
     player_id=${playerId};`;
  await db.run(yy);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const yyy = `
   DELETE FROM 
   cricket_team
   WHERE
   player_id=${playerId};`;
  await db.run(yyy);
  response.send("Player Removed");
});
module.exports = app;
