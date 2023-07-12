interface ResultType {
  [key: string]: any;
}

export default interface AppResponseType<T = ResultType> {
  isSuccess: boolean;
  message: string;
  result: T;
}
