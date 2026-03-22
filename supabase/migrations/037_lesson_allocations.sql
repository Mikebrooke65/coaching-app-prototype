-- Migration 037: Lesson Allocations
-- Allows admins to allocate specific lessons to age groups
-- Community: typically allocate all lessons to an age group
-- Academy: selectively allocate 2-3 lessons per week
--

-- ============================================================================
-- LESSON ALLOCATIONS TABLE
-- ============================================================================
CREATE TABLE lesson_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  age_group TEXT NOT NULL,
  allocated_by UUID REFERENCES users(id),
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  -- Prevent duplicate allocations
  UNIQUE(lesson_id, age_group)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_lesson_allocations_lesson_id ON lesson_allocations(lesson_id);
CREATE INDEX idx_lesson_allocations_age_group ON lesson_allocations(age_group);
CREATE INDEX idx_lesson_allocations_allocated_by ON lesson_allocations(allocated_by);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE lesson_allocations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view allocations
CREATE POLICY "Anyone can view lesson allocations"
  ON lesson_allocations FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage allocations
CREATE POLICY "Admins can manage lesson allocations"
  ON lesson_allocations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE lesson_allocations IS 'Tracks which lessons are allocated/available to specific age groups';
COMMENT ON COLUMN lesson_allocations.age_group IS 'Age group this lesson is allocated to (U4-U17)';
COMMENT ON COLUMN lesson_allocations.notes IS 'Optional notes about why this lesson was allocated';
