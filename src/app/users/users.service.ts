import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreUserDto, UpdateUserDto } from './users.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from './users.entity';
import { ReferencesService } from '../references/references.service';
import { CurrencyCodes } from '../references/entities/currency.entity';
import { Role, RoleCodes } from '../roles/roles.entity';
import { FreelancerService } from '../freelancers/services/freelancers.service';
import { UserMetadata } from 'src/common/types/userMetadata';
import { Freelancer } from '../freelancers/entities/freelancers.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private referencesService: ReferencesService,
    private freelancerService: FreelancerService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async store(payload: StoreUserDto): Promise<User> {
    const currency = await this.referencesService.getCurrencyByCode(
      CurrencyCodes.TENGE,
    );
    const user = await this.userRepository.save({
      ...payload,
      currency,
      isBan: false,
      balance: 0,
    });
    await this.defineUserRole({ user, role: payload.role });

    return user;
  }

  async getAll(): Promise<User[]>{
    return await this.userRepository.find({
      relations: ['role', 'country', 'city']
    })
  }

  async update(user: UserMetadata, payload: UpdateUserDto): Promise<User> {
    const userAccount = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!userAccount)
      throw new HttpException(
        `User with id: ${userAccount.id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    await this.userRepository.update(userAccount.id, {
      ...payload,
    });

    return await this.getOne(userAccount.id);
  }

  async getOne(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'currency'],
    });
  }

  async increaseBalance(
    userId: string,
    balance: number,
  ): Promise<{ success: boolean }> {
    const userAccount = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'balance'],
    });

    if (!userAccount || balance <= 0) return { success: false };

    await this.dataSource.transaction(async (manager) => {
      await manager.save(User, {
        id: userId,
        balance: userAccount.balance + balance,
      });
    });

    console.log(`Increase balance of user with id: ${userId} to ${balance}`);

    return { success: true };
  }

  async getBalance(userId: string): Promise<number> {
    return (
      await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'balance'],
      })
    ).balance;
  }

  async getOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'surname',
        'middleName',
        'email',
        'password',
        'phoneNumber',
        'photo',
        'balance',
        'isBan',
      ],
      relations: ['currency', 'role', 'country', 'city'],
    });
  }

  async defineUserRole(payload: { user: User; role: Role }): Promise<void> {
    if (payload.role.code == RoleCodes.FREELANCER)
      await this.freelancerService.store(payload.user);
  }

  async getAccount(
    user: UserMetadata,
  ): Promise<User & { account: Freelancer | null }> {
    const userAccount = await this.userRepository.findOne({
      where: { id: user.id },
      select: [
        'id',
        'name',
        'surname',
        'middleName',
        'email',
        'phoneNumber',
        'photo',
        'balance',
        'isBan',
      ],
      relations: ['role', 'currency', 'country', 'city'],
    });

    return {
      ...userAccount,
      account:
        userAccount.role.code == RoleCodes.FREELANCER
          ? await this.freelancerService.getOneByUser(userAccount.id)
          : null,
    };
  }

  async delete(user: UserMetadata): Promise<DeleteResult> {
    return await this.userRepository.softDelete(user.id);
  }

  async getAdmin(): Promise<User> {
    return await this.userRepository.findOne({
      where: { role: { code: RoleCodes.ADMIN } },
    });
  }

  async decreaseBalance(
    userId: string,
    balance: number,
  ): Promise<{ success: boolean }> {
    const userBalance = await this.getBalance(userId);
    await this.dataSource.transaction(async (manager) => {
      await manager.save(User, { id: userId, balance: userBalance - balance });
    });
    console.log(`Decrease balance of user with id: ${userId} to ${balance}`);
    return { success: true };
  }
}
