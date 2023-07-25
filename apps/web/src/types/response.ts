interface ResponseBase {
  success: boolean;
}

interface SuccessResponse<T> extends ResponseBase {
  success: true;
  data: T;
}

interface ErrorResponse extends ResponseBase {
  success: false;
  errorMessage: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;
