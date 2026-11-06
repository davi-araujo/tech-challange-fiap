import { HttpRequest, HttpResponse } from '../../3-interface-adapters/http/HttpTypes';

export type Rota = Readonly<{
    method: string;
    path: string;
    handler: (req: HttpRequest) => Promise<HttpResponse>;
}>;