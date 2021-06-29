-- getQueryList
SELECT * FROM queries
  WHERE project_id = :projectId;

-- createQuery
INSERT INTO queries (title, query, chart_type, project_id) VALUES
  (:title, :query, :chartType, :projectId)
  RETURNING *;

-- updateQuery
UPDATE queries SET 
title= :title,
query = :query,
chart_type = :chartType,
project_id = :projectId
 WHERE query_id = :queryId

-- deleteQuery
DELETE FROM queries WHERE query_id = :queryId

-- checkQuery
SELECT * FROM queries
WHERE query_id = :queryId AND project_id = :projectId

-- getQuery
SELECT * FROM queries
WHERE query_id = :queryId

-- transferQuery
UPDATE queries SET 
project_id = :projectId
 WHERE query_id = :queryId