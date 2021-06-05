-- getAllMyProject
SELECT * FROM projects
  WHERE user_id = :userId;

-- createProject
INSERT INTO projects (project_name, user_id) VALUES
  (:projectName, :userId)
  RETURNING *;

-- updateProject
UPDATE projects
SET project_name = :projectName
WHERE project_id = :projectId

-- deleteProject
DELETE FROM projects where project_id = :projectId

-- checkProject
SELECT * FROM projects
WHERE user_id = :userId AND project_id = :projectId

-- readProject
SELECT * FROM projects
WHERE project_id = :projectId

-- getAllProjects
SELECT * from projects
LIMIT 10

-- findProject
SELECT * FROM projects
  WHERE project_name = :projectName;