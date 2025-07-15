import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('recipes')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rate')
  create(@Param('id') recipeId: string, @Body() createRatingDto: CreateRatingDto, @Req() req) {
    return this.ratingService.create(+recipeId, createRatingDto, req.user.id);
  }

  @Get(':id/average-rating')
  getAverageRating(@Param('id') recipeId: string) {
    return this.ratingService.getRecipeAverageRating(+recipeId);
  }
}