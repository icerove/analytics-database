-- getQueryList
SELECT * FROM queries
  WHERE user_id = :user_id;

-- createQuery
INSERT INTO queries (query_name, query, options, formatting, create_time, user_id) VALUES
  (:queryName, :query, :options, :formatting, :createTime, :userId)
  RETURNING *;

-- updateQuery
UPDATE queries SET 
query_name= :queryName,
query = :query,
options = :options,
formatting = :formatting,
create_time = :createTime,
user_id = :userId
WHERE query_id = :queryId
RETURNING *;

-- deleteQuery
DELETE FROM queries WHERE query_id = :queryId

-- checkQuery
SELECT * FROM queries
WHERE query_id = :queryId AND user_id = :userId

-- getQuery
SELECT * FROM queries
WHERE query_id = :queryId

-- setAsExample
INSERT INTO examples (query_id, category) VALUES
  (:queryId, :category)
  RETURNING *;

-- deleteFromExample
DELETE FROM examples WHERE query_id = :queryId

-- updateCategory
UPDATE examples SET category = :category WHERE query_id = :queryId

-- getExampleList
SELECT * FROM examples;