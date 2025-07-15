import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User as PrismaUser } from '@prisma/client'; 


export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    createdAt: Date; 
  };
}


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signin(dto: AuthDto): Promise<AuthResponse> { 
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      },
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordCompare = await argon.verify(user.password, dto.password);

    if (!passwordCompare) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const { password, ...userWithoutPassword } = user;
    return this.signToken(userWithoutPassword);
  }

  async signup(dto: AuthDto): Promise<AuthResponse> { 
    try {
      const passwordHash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        }
      });


      return this.signToken(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already taken');
        }
      }
      throw error; 
    }
  }

  async signToken(user: { id: number; email: string; createdAt: Date }): Promise<AuthResponse> {
    const payload = {
      sub: user.id,
      email: user.email
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    return {
      access_token: token,
      user: { 
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}