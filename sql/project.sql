-- getAllProjects
SELECT * from projects;

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
WHERE project_id = :projectId;

-- deleteProject
DELETE FROM projects where project_id = :projectId;

-- checkProject
SELECT * FROM projects
WHERE user_id = :userId AND project_id = :projectId;

-- readProject
SELECT * FROM projects
WHERE project_id = :projectId;

-- findProject
SELECT * FROM projects
  WHERE project_name = :projectName;

-- addQueryToProject
INSERT INTO project_has_query (project_id, query_id) VALUES
  (:projectId, :queryId)
  RETURNING *;

-- deleteQueryFromProject
DELETE FROM project_has_query where project_id = :projectId AND query_id = :queryId;

-- getProjectHasQueryList
SELECT * FROM project_has_query
  WHERE project_id = :projectId;