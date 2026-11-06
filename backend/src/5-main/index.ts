import { criarServidor } from "../4-infrastructure/http/server";
import { montarContainer } from "./container";

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) throw new Error('Defina DATABASE_URL, ex.: postgres://app:app@localhost:3000/pedidos');


const { pool, rotas } = montarContainer(databaseUrl);
const servidor = criarServidor(rotas);

servidor.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));