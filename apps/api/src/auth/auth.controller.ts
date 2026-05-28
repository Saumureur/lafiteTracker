import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentification AD')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @UseGuards(AuthGuard('ldap')) // Utilise notre stratégie LDAP avant d'entrer ici
  @ApiOperation({ summary: 'Connexion via les identifiants Active Directory' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'op.test' },
        password: { type: 'string', example: 'MonMotDePasseWindows123' },
      },
    },
  })
  async login(@Request() req: any) {
    // req.user contient l'objet renvoyé par la méthode validate() de notre stratégie
    const payload = { 
      username: req.user.username, 
      displayName: req.user.displayName, 
      roles: req.user.roles 
    };

    // On génère le badge d'accès (JWT) signé électroniquement
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }
}