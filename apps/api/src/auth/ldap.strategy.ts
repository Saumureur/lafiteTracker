import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-ldapauth';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private readonly configService: ConfigService) {
    super({
      server: {
        // L'ajout de "as string" corrige l'erreur TypeScript
        url: configService.get<string>('LDAP_URL') as string,
        bindDN: configService.get<string>('LDAP_BIND_DN') as string,
        bindCredentials: configService.get<string>('LDAP_BIND_PASS') as string,
        searchBase: configService.get<string>('LDAP_SEARCH_BASE') as string,
        searchFilter: '(sAMAccountName={{username}})',
      },
    });
  }

  async validate(user: any) {
    if (!user) {
      throw new UnauthorizedException('Identifiants Windows incorrects');
    }

    let groups = user.memberOf || [];
    if (!Array.isArray(groups)) {
      groups = [groups];
    }

    const roles: string[] = [];
    
    // On récupère les listes depuis le .env et on les transforme en tableaux
    const adminGroups = (this.configService.get<string>('AD_ADMIN_GROUPS') || '').split(',');
    const opGroups = (this.configService.get<string>('AD_OPERATEUR_GROUPS') || '').split(',');

    // On vérifie si l'utilisateur possède au moins un des groupes listés
    const isADmin = groups.some((userGroup: string) => 
      adminGroups.some(adminGroup => userGroup.includes(adminGroup))
    );
    if (isADmin) roles.push('ADMIN');

    const isOperateur = groups.some((userGroup: string) => 
      opGroups.some(opGroup => userGroup.includes(opGroup))
    );
    if (isOperateur) roles.push('OPERATEUR');

    if (roles.length === 0) {
      roles.push('LECTEUR');
    }

    return {
      username: user.sAMAccountName,
      displayName: user.displayName,
      roles: roles,
    };
  }
}