import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RolesModule } from './app/roles/roles.module';
import { ReferencesModule } from './app/references/references.module';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { FilesModule } from './app/files/files.module';
import { AdminModule } from './app/admin/admin.module';
import { UsersBasketModule } from './app/users-basket/users-basket.module';
import { CustomersModule } from './app/customers/customers.module';
import { TasksModule } from './app/tasks/tasks.module';
import { ChatsModule } from './app/chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: ['dist/**/**/*.entity{.js,.ts}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    RolesModule,
    ReferencesModule,
    UsersModule,
    AuthModule,
    FilesModule,
    AdminModule,
    UsersBasketModule,
    TasksModule,
    CustomersModule,
    ChatsModule,
  ],
})
export class AppModule {}
