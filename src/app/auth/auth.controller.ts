import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { AuthInterface } from './auth.type';
import { StoreUserDto } from '../users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto): Promise<AuthInterface> {
    return this.authService.login(payload);
  }

  @Post('register')
  register(@Body() payload: StoreUserDto): Promise<AuthInterface> {
    return this.authService.register(payload);
  }
}
