import { HttpError } from '@app/core/interceptors';

export function toErrorMessage(error: unknown): string {
  if (error instanceof HttpError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}
