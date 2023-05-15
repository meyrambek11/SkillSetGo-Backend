import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import { AuthInterface } from './auth.type';
import { StoreUserDto } from '../users/users.dto';
import { User } from '../users/users.entity';
import { RolesService } from '../roles/roles.service';
import { FreelancerService } from '../freelancers/services/freelancers.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private freelancersService: FreelancerService,
  ) {}

  async login(payload: LoginDto): Promise<AuthInterface> {
    const user = await this.validate(payload);
    const accessToken = this.generateToken(user);
    return {
      user,
      accessToken,
    };
  }

  async register(payload: StoreUserDto): Promise<AuthInterface> {
    const candidate = await this.userService.getOneByEmail(payload.email);
    if (candidate)
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    const role = await this.rolesService.getOne(payload.role.id);
    if (!role)
      throw new HttpException('Неправильный роль', HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.userService.store({
      ...payload,
      role,
      password: hashPassword,
    });
    delete user.password;
    const accessToken = this.generateToken(user);
    return {
      user,
      accessToken,
    };
  }

  async validate(payload: LoginDto): Promise<User> {
    const user = await this.userService.getOneByEmail(payload.email);
    if (!user)
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    const passwordEqual = await bcrypt.compare(payload.password, user.password);
    if (!passwordEqual) throw new UnauthorizedException('Некорректный пароль');
    delete user['password'];
    return user;
  }

  generateToken(user: User): string {
    return this.jwtService.sign({ ...user });
  }
}
