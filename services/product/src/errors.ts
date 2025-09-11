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

const CODE_STATUS: Record<string, number> = {
  PRODUCT_NOT_FOUND: 404,
  OUT_OF_STOCK: 400,
  ITEM_NOT_FOUND: 404,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

export function toHttpError(err: unknown): { status: number; body: any } {
  const anyErr = err as any;

  if (err instanceof DomainError) {
    const status = err.status ?? CODE_STATUS[err.code] ?? 400;
    return {
      status,
      body: { success: false, error: err.code, message: err.message, details: err.details },
    };
  }

  // Fastify schema validation (AJV)
  if (anyErr?.validation || anyErr?.code === 'FST_ERR_VALIDATION') {
    return {
      status: 400,
      body: {
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid request',
        details: anyErr?.validation,
      },
    };
  }

  // JWT/authorization style errors
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

  // Generic message-as-code mapping
  if (typeof anyErr?.message === 'string') {
    const status = CODE_STATUS[anyErr.message];
    if (status) return { status, body: { success: false, error: anyErr.message } };
  }

  return {
    status: 500,
    body: { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' },
  };
}
