export type Done = (err: any, user?: any) => void;

export type JwtPayload = { sub: number; jti: number; exp: number };
