
-- createResult
INSERT INTO results (result, executed_at, query_id) VALUES
  (:result, :executedAt  :queryId)
  RETURNING *;

-- updateResult
UPDATE queries SET result = :result, executed_at:executedAt WHERE result_id = :resultId

-- updateTime

-- deleteResult
DELETE FROM results WHERE result_id = :resultId

-- checkResult
SELECT * FROM queries
WHERE result_id = :resultId AND query_id = :queryId

-- getResult
SELECT * FROM results
WHERE result_id = :resultId