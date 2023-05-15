export class GetAllResponse<T> {
  data: T[];
  meta: {
    limit: number;
    total: number;
    page: number;
  };
}
