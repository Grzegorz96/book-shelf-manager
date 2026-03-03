import { BookReadingStatus } from '../models';

export const BOOKS_STALE_TIME = 5 * 60 * 1_000; // 5 minutes
export const DEFAULT_BOOK_STATUS: BookReadingStatus = 'todo';
