
-- createResult
INSERT INTO results (result, executed_at, query_id) VALUES
  (:result, :executedAt,  :queryId)
  RETURNING *;

-- updateResult
UPDATE results SET result = :result, executed_at = :executedAt WHERE result_id = :resultId
RETURNING *;

-- deleteResult
DELETE FROM results WHERE result_id = :resultId

-- checkResult
SELECT * FROM results
WHERE result_id = :resultId AND query_id = :queryId

-- getResult
SELECT * FROM results
WHERE result_id = :resultId