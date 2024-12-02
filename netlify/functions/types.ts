import { HandlerEvent } from '@netlify/functions';

export interface RouteHandler {
  (event: HandlerEvent, params: Record<string, string>): Promise<{
    data: any;
    status?: number;
  }>;
}

export interface RouteConfig {
  path: string;
  method: string;
  handler: RouteHandler;
}

export interface ApiResponse {
  data?: any;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}