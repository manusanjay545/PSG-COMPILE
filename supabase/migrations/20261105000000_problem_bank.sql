ALTER TYPE difficulty_level ADD VALUE IF NOT EXISTS 'very_hard';

ALTER TABLE problems
  ADD COLUMN IF NOT EXISTS topic TEXT NOT NULL DEFAULT 'arrays',
  ADD COLUMN IF NOT EXISTS diagram TEXT,
  ADD COLUMN IF NOT EXISTS solution_code JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS problems_public_archive_idx
  ON problems (is_published, difficulty, problem_number);
CREATE INDEX IF NOT EXISTS problems_topic_archive_idx
  ON problems (topic, problem_number);

CREATE OR REPLACE FUNCTION public.seed_problem_bank_batch(batch JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  test_item JSONB;
  current_problem_id UUID;
  inserted_count INTEGER := 0;
BEGIN
  IF jsonb_typeof(batch) <> 'array' THEN
    RAISE EXCEPTION 'Problem batch must be a JSON array';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(batch) AS rows(value) LOOP
    current_problem_id := (item->>'id')::UUID;

    INSERT INTO problems (
      id, problem_number, title, slug, difficulty, topic, description, constraints,
      input_format, output_format, examples, hints, editorial, starter_code,
      solution_code, diagram, is_published, is_premium
    ) VALUES (
      current_problem_id,
      (item->>'problem_number')::INTEGER,
      item->>'title', item->>'slug', (item->>'difficulty')::difficulty_level,
      item->>'topic', item->>'description', item->>'constraints',
      item->>'input_format', item->>'output_format', COALESCE(item->'examples', '[]'::JSONB),
      COALESCE(item->'hints', '[]'::JSONB), item->>'editorial',
      COALESCE(item->'starter_code', '{}'::JSONB), COALESCE(item->'solution_code', '{}'::JSONB),
      item->>'diagram', COALESCE((item->>'is_published')::BOOLEAN, TRUE),
      COALESCE((item->>'is_premium')::BOOLEAN, FALSE)
    )
    ON CONFLICT (id) DO UPDATE SET
      problem_number = EXCLUDED.problem_number,
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      difficulty = EXCLUDED.difficulty,
      topic = EXCLUDED.topic,
      description = EXCLUDED.description,
      constraints = EXCLUDED.constraints,
      input_format = EXCLUDED.input_format,
      output_format = EXCLUDED.output_format,
      examples = EXCLUDED.examples,
      hints = EXCLUDED.hints,
      editorial = EXCLUDED.editorial,
      starter_code = EXCLUDED.starter_code,
      solution_code = EXCLUDED.solution_code,
      diagram = EXCLUDED.diagram,
      is_published = EXCLUDED.is_published,
      is_premium = EXCLUDED.is_premium,
      updated_at = NOW();

    DELETE FROM test_cases WHERE problem_id = current_problem_id;
    FOR test_item IN SELECT value FROM jsonb_array_elements(COALESCE(item->'test_cases', '[]'::JSONB)) AS cases(value) LOOP
      INSERT INTO test_cases (
        id, problem_id, input, expected_output, is_sample, is_hidden,
        explanation, sort_order, time_limit_ms, memory_limit_mb
      ) VALUES (
        (test_item->>'id')::UUID, current_problem_id, test_item->>'input',
        test_item->>'expected_output', COALESCE((test_item->>'is_sample')::BOOLEAN, FALSE),
        COALESCE((test_item->>'is_hidden')::BOOLEAN, TRUE), test_item->>'explanation',
        COALESCE((test_item->>'sort_order')::INTEGER, 0),
        COALESCE((test_item->>'time_limit_ms')::INTEGER, 2000),
        COALESCE((test_item->>'memory_limit_mb')::INTEGER, 256)
      );
    END LOOP;

    inserted_count := inserted_count + 1;
  END LOOP;

  PERFORM setval(
    'problems_problem_number_seq'::REGCLASS,
    GREATEST(COALESCE((SELECT MAX(problem_number) FROM problems), 1), 1),
    TRUE
  );
  RETURN inserted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.seed_problem_bank_batch(JSONB) FROM PUBLIC, anon, authenticated;
