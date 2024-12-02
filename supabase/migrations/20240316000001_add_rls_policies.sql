-- Add RLS policies for all tables

-- Users
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage users"
  ON public.users
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- User Groups
CREATE POLICY "Public read access for user groups"
  ON public.user_groups
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage user groups"
  ON public.user_groups
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Categories
CREATE POLICY "Public read access for categories"
  ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Courses
CREATE POLICY "Public read access for published courses"
  ON public.courses
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Instructors can manage their courses"
  ON public.courses
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'instructor' OR role = 'admin')
  ));

-- Lessons
CREATE POLICY "Public read access for lessons of published courses"
  ON public.lessons
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE id = course_id AND status = 'published'
  ));

CREATE POLICY "Instructors can manage lessons"
  ON public.lessons
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'instructor' OR role = 'admin')
  ));

-- Progress tracking
CREATE POLICY "Users can view their own progress"
  ON public.course_progress
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON public.course_progress
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own lesson progress"
  ON public.lesson_progress
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.course_progress 
    WHERE id = progress_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own lesson progress"
  ON public.lesson_progress
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.course_progress 
    WHERE id = progress_id AND user_id = auth.uid()
  ));

-- Certificates
CREATE POLICY "Users can view their own certificates"
  ON public.certificates
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage certificates"
  ON public.certificates
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- E-books
CREATE POLICY "Public read access for e-books"
  ON public.ebooks
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage e-books"
  ON public.ebooks
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- News
CREATE POLICY "Public read access for published news"
  ON public.news
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can manage their news"
  ON public.news
  FOR ALL
  USING (author_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Comments
CREATE POLICY "Public read access for comments"
  ON public.comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own comments"
  ON public.comments
  FOR ALL
  USING (author_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));