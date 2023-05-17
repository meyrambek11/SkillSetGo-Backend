import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserMetadata } from 'src/common/types/userMetadata';
import { ResponseDto } from '../orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import { FreelancerService } from 'src/app/freelancers/services/freelancers.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private freelancerService: FreelancerService
    ){}

    async responseToTask(user: UserMetadata, payload: ResponseDto){
        const freelancer = await this.freelancerService.getOneByUser(user.id);

        if(!freelancer)
            throw new HttpException(
                `Freelancer with user id: ${user.id} does not exist`,
                HttpStatus.BAD_REQUEST,
            );
    }
}
