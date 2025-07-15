import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string; 
}