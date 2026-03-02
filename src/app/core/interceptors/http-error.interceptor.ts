import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export class HttpError extends Error {
  constructor(
    public override message: string,
    public status?: number,
  ) {
    super(message);
  }
}

function parseErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return 'No connection to the server. Check your internet connection.';
    case 400:
      return error.error?.message ?? 'Invalid request.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this operation.';
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'The request timed out.';
    case 422:
      return error.error?.message ?? 'The data is invalid.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'The server is temporarily unavailable. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return error.error?.message ?? `An unexpected error occurred (${error.status}).`;
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = parseErrorMessage(error);
      return throwError(() => new HttpError(message, error.status));
    }),
  );
};
