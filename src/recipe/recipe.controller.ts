import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @Req() req) {
    return this.recipeService.create(createRecipeDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findMyRecipes(@Req() req) {
    return this.recipeService.findMyRecipes(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Req() req) {
    return this.recipeService.update(+id, updateRecipeDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.recipeService.remove(+id, req.user.id);
  }
}
