// utils/jwt.d.ts
declare module 'jsonwebtoken' {
  export interface DecodedToken {
    userId: string; // or number, depending on how the user ID is stored in the token
    exp: number;
  }
}
