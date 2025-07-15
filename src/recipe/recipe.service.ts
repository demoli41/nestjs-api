import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto, userId: number) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        creatorId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        ratings: {
          select: {
            score: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        ratings: {
          select: {
            score: true,
          },
        },
      },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async findMyRecipes(userId: number) {
    return this.prisma.recipe.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        ratings: {
          select: {
            score: true,
          },
        },
      },
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    if (recipe.creatorId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this recipe.');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
    });
  }

  async remove(id: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    if (recipe.creatorId !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this recipe.');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });
    return { message: 'Recipe deleted successfully' };
  }
}
