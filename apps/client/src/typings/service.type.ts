interface FailResponse {
  status: "Error";
  message: string;
}

type SuccessResponse<T> = T extends undefined
  ? {
      status: "Success";
    }
  : {
      status: "Success";
      data: T;
    };

export type ServiceResponse<T = undefined> = SuccessResponse<T> | FailResponse;
