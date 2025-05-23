import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkuDto {
  @ApiProperty({ description: 'Name of the inventory item' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({
    description: 'SKU code (leave empty for auto-generation)',
    required: false,
  })
  @IsString()
  @IsOptional()
  skuCode?: string;

  @ApiProperty({ description: 'Item category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Item subcategory' })
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @ApiProperty({ description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Branch ID to associate SKU with' })
  @IsString()
  @IsNotEmpty()
  branch: string;
}
