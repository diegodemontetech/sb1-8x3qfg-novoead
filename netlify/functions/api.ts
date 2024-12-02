import { Handler } from '@netlify/functions';
import { supabase, corsHeaders } from './config';
import { courseRoutes } from './routes/courses';
import { newsRoutes } from './routes/news';
import { categoryRoutes } from './routes/categories';
import { RouteHandler } from './types';

// Combine all routes
const routes: Record<string, RouteHandler> = {
  ...courseRoutes,
  ...newsRoutes,
  ...categoryRoutes
};

export const handler: Handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders
    };
  }

  try {
    // Extract auth token from headers
    const token = event.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    // Route handling
    const path = event.path.replace('/api/', '');
    const routeKey = `${event.httpMethod} ${path.split('/').slice(0, 2).join('/')}`;
    const handler = routes[routeKey];

    if (!handler) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Route not found' })
      };
    }

    // Extract route parameters
    const params: Record<string, string> = {};
    const pathParts = path.split('/');
    const routeParts = routeKey.split('/');
    
    routeParts.forEach((part, i) => {
      if (part.startsWith(':')) {
        params[part.slice(1)] = pathParts[i];
      }
    });

    // Execute route handler
    const result = await handler(event, params);

    return {
      statusCode: result.status || 200,
      headers: corsHeaders,
      body: JSON.stringify({ data: result.data })
    };

  } catch (error: any) {
    console.error('API Error:', error);
    
    return {
      statusCode: error.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          code: error.code,
          details: error.details
        }
      })
    };
  }
};