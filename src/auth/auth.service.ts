import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload-interface';
import { User } from './user.entity';
import { UserRespository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRespository)
        private userRepository: UserRespository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) {
        const email = await this.userRepository.validateUserPassword(authCredentialsDto);
        
        if (!email) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const jwtPayload: JwtPayload = { email };
        const accessToken = await this.jwtService.sign(jwtPayload);
        return { accessToken };
    }
 }
