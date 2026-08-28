export class OrderNotFoundError extends Error {
  statusCode = 404;

  constructor(orderNumber: string) {
    super(`Order "${orderNumber}" was not found.`);
    this.name = "OrderNotFoundError";
  }
}

export class InvalidOrderTransitionError extends Error {
  statusCode = 409;

  constructor(currentStatus: string, nextStatus: string) {
    super(
      `Cannot transition order from "${currentStatus}" to "${nextStatus}".`,
    );

    this.name = "InvalidOrderTransitionError";
  }
}

export class OrderPaymentRequiredError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = "OrderPaymentRequiredError";
  }
}

export class InvalidOrderOperationError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = "InvalidOrderOperationError";
  }
}
