declare namespace Service {
  interface RegisterEntryOptions {
    challenge: string;
    rpId: string;
    rpName: string;
    excludeCredentials: {
      id: string;
      type: "public-key";
      transports: string[];
    }[];
  }

  interface AuthenticateEntryOptions {
    challenge: string;
    allowCredentials: {
      id: string;
      type: "public-key";
      transports: string[];
    }[];
    rpId: string;
  }

  interface SuccessfulResponse<T> {
    status: "Success";
    data: T;
  }
}
