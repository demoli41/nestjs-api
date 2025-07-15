import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { PrismaService } from '../prisma/prisma.service'; 
import { RecipeService } from './recipe.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService, PrismaService],
})
export class RecipeModule {}
