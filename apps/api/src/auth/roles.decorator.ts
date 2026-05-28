import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Ce décorateur nous permettra d'écrire @Roles('ADMIN', 'OPERATEUR') sur nos routes
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);