import { createServer, IncomingMessage, Server, ServerResponse } from 'node:http';
import { Rota } from '../ports/rota';

const extrairParametrosDoPath = (pathRota: string, pathReq: string): Record<string, string> | null => {
    const segmentosRota = pathRota.split('/').filter(Boolean);
    const segmentosReq = pathReq.split('/').filter(Boolean);

    if (segmentosReq.length !== segmentosRota.length) return null;

    const params: Record<string, string> = {}

    for (let i = 0; i < segmentosRota.length; i++) {
        const iteratorSegmentoRota = segmentosRota[i];
        const iteratorSegmentoReq = segmentosReq[i];

        if (iteratorSegmentoRota?.startsWith(":")) {
            if (iteratorSegmentoReq === undefined) return null;

            const nomeParametro = iteratorSegmentoRota.slice(1);

            try {
                params[nomeParametro] = iteratorSegmentoReq;
            } catch {
                return null;
            }
        } else if (iteratorSegmentoReq !== iteratorSegmentoRota) {
            return null;
        }
    }

    return params;
}

const lerBody = async (req: IncomingMessage): Promise<unknown> => {
    const partes: Buffer[] = [];

    for await (const parte of req) {
        partes.push(Buffer.isBuffer(parte) ? parte : Buffer.from(parte));
    }

    const texto = Buffer.concat(partes).toString('utf-8');

    try {
        return texto ? JSON.parse(texto) : {};
    } catch {
        return {};
    }
};

const processarRequisicao = async (req: IncomingMessage, res: ServerResponse, rotas: readonly Rota[]): Promise<void> => {
    try {
        const urlReq = new URL(req.url ?? '/', 'http://localhost:5432');
        const pathReq = urlReq.pathname;

        for (const rota of rotas) {
            if (rota.method !== req.method) continue;

            const params = extrairParametrosDoPath(rota.path, pathReq);

            if (params === null) continue;

            const body = await lerBody(req);

            const handlerResponse = await rota.handler({ params, body });

            res.writeHead(handlerResponse.status, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(handlerResponse.body));
            return;
        }

        res.writeHead(404, {
            'Content-Type': 'application/json'
        })

        res.end(JSON.stringify({
            erro: 'Rota não encontrada.'
        }));

    } catch (e) {
        console.error(e);

        if (res.headersSent) {
            res.end();
            return;
        }

        res.writeHead(500, {
            'Content-Type': 'application/json'
        })

        res.end(JSON.stringify({
            erro: 'Erro interno aconteceu.'
        }));
    }
}

export const criarServidor = (
  rotas: readonly Rota[]
): Server => {

  return createServer((req, res) => {
    void processarRequisicao(req, res, rotas);
  });
};