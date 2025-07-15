import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(recipeId: number, createRatingDto: CreateRatingDto, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found.`);
    }

    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this recipe.');
    }

    return this.prisma.rating.create({
      data: {
        score: createRatingDto.score,
        userId: userId,
        recipeId: recipeId,
      },
    });
  }

  async getRecipeAverageRating(recipeId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { recipeId },
      select: { score: true },
    });

    if (ratings.length === 0) {
      return 0;
    }

    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return totalScore / ratings.length;
  }
}
