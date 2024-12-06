class APIError extends Error {
  public success: boolean;
  public statusCode: number;
  public errors: Array<string>;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    errors: Array<string>
  ) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;
    this.errors = errors;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { APIError };
