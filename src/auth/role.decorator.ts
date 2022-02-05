import { Role } from '../users/entities/users.entity';
import { SetMetadata } from '@nestjs/common';
export type Roles = keyof typeof Role | 'Any';
export const SetRole = (roles: Roles[]) => SetMetadata('roles', roles);
