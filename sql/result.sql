
-- createResult
INSERT INTO results (result, query_id) VALUES
  (:result, :queryId)
  RETURNING *;

-- updateResult
UPDATE queries SET result = :result WHERE result_id = :resultId

-- deleteResult
DELETE FROM results WHERE result_id = :resultId

-- checkResult
SELECT * FROM queries
WHERE result_id = :resultId AND query_id = :queryId

-- getResult
SELECT * FROM results
WHERE result_id = :resultId