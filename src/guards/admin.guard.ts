import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminsService } from "src/modules/shared/admin/admin.service";
import { JudgesService } from "src/modules/shared/judge/judge.service";
import { TokenPayload } from "src/types/token/token.types";

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminsService,
    private judgeService: JudgesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    }
    const bearer = authHeader.split(' ')[0]
    const token = authHeader.split(' ')[1]
    let user: TokenPayload
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    }
    try {
      user = this.jwtService.verify(token) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    }
    const admin = await this.adminService.findByPersonId(user.personId)
    req.user = user;
    if (!admin) {
      throw new ForbiddenException('Недостаточно прав')
    }
    return true;
  }
}
