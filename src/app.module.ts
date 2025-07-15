import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { RatingModule } from './rating/rating.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, RecipeModule, RatingModule, PrismaModule],
})
export class AppModule {}
