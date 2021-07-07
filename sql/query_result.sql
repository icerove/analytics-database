
-- createResult
INSERT INTO results (query_result, executed_at, query_id) VALUES
  (:result, :executedAt,  :queryId)
  RETURNING *;