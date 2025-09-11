export class DomainError extends Error {
  code: string;
  status?: number;
  details?: unknown;

  constructor(code: string, message?: string, status?: number, details?: unknown) {
    super(message ?? code);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Centralized mapping of domain error codes to HTTP status
const CODE_STATUS: Record<string, number> = {
  EMAIL_TAKEN: 409,
  INVALID_CREDENTIALS: 401,
  USER_NOT_FOUND: 404,
  SIGNUP_FAILED: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

// Convert any thrown error to a consistent HTTP response shape
export function toHttpError(err: unknown): { status: number; body: any } {
  // DomainError explicitly carries code/status
  if (err instanceof DomainError) {
    const status = err.status ?? CODE_STATUS[err.code] ?? 400;
    return {
      status,
      body: { success: false, error: err.code, message: err.message, details: err.details },
    };
  }

  // Zod validation
  const anyErr = err as any;
  if (anyErr?.name === 'ZodError') {
    return {
      status: 400,
      body: {
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid request',
        details: anyErr.errors,
      },
    };
  }

  // Fastify-JWT common errors → 401
  if (
    anyErr?.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
    anyErr?.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' ||
    anyErr?.code === 'FAST_JWT_MISSING_SECRET'
  ) {
    return {
      status: 401,
      body: { success: false, error: 'UNAUTHORIZED', message: 'Unauthorized' },
    };
  }

  // Generic Error with known message code mapping
  if (typeof anyErr?.message === 'string' && anyErr.message) {
    const maybeCode = anyErr.message as string;
    const status = CODE_STATUS[maybeCode];
    if (status) {
      return { status, body: { success: false, error: maybeCode } };
    }
  }

  // Fallback → 500
  return {
    status: 500,
    body: { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' },
  };
}
