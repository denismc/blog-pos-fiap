export interface IAxiosError {
  response?: {
    data?: {
      erro?: string;
    };
  };
}