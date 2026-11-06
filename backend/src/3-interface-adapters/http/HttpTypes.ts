export interface HttpRequest {
  params: Record<string, string>;
  body: unknown;
}

export interface HttpResponse {
  status: number;
  body: unknown;
}
