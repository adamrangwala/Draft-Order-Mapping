import db from './index';

const createLeaguesTable = `
  CREATE TABLE IF NOT EXISTS leagues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    commissioner_id TEXT NOT NULL,
    max_members INTEGER NOT NULL,
    status TEXT DEFAULT 'waiting',
    selected_landmark_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createTeamsTable = `
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    league_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    player_name TEXT NOT NULL,
    email TEXT NOT NULL,
    icon_id TEXT NOT NULL,
    selected_lat REAL,
    selected_lng REAL,
    has_submitted BOOLEAN DEFAULT FALSE,
    distance_from_landmark REAL,
    draft_position INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (league_id) REFERENCES leagues (id)
  );
`;

const createLandmarksTable = `
  CREATE TABLE IF NOT EXISTS landmarks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    country TEXT
  );
`;

db.serialize(() => {
  db.run(createLeaguesTable);
  db.run(createTeamsTable);
  db.run(createLandmarksTable, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database tables created successfully.');
  });
});

db.close();