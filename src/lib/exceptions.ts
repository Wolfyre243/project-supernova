export class AuthRequiredError extends Error {
  constructor(
    message: string = 'Authentication required to access this page. Please log in and try again.',
  ) {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

export class UnauthorisedError extends Error {
  constructor(message: string = 'User is not authorised to access this page.') {
    super(message);
    this.name = 'UnauthorisedError';
  }
}

export class APIError extends Error {
  status: number;

  constructor(
    message: string = 'An error occurred while processing your request.',
    status: number = 500,
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}
