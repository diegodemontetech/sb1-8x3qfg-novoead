import { supabase } from './config';
import { handleError, handleResponse } from './config';

// Export utilities
export { supabase, handleError, handleResponse };

// Export services
export { authService } from './auth.service';
export { userService } from './user.service';
export { groupService } from './group.service';
export { courseService } from './course.service';
export { lessonService } from './lesson.service';
export { categoryService } from './category.service';
export { newsService } from './news.service';
export { quizService } from './quiz.service';
export { certificateService } from './certificate.service';
export { ebookService } from './ebook.service';

// Export types
export type { User } from '../../types';