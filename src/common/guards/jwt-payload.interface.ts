export enum JwtPurpose {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface JwtPayload {
  sub: string;
  purpose: JwtPurpose;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
  jti?: string;
}
