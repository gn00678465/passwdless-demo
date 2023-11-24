declare namespace Service {
  interface RegisterEntryOptions {
    challenge: string;
    rpId: string;
    rpName: string;
    excludeCredentials: {
      id: string;
      type: 'public-key';
      transports: string[];
    }[];
  }

  interface SuccessfulResponse<T> {
    status: 'Success';
    data: T;
  }
}
