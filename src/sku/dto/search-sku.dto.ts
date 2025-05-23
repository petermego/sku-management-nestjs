import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchSkuDto {
  @ApiPropertyOptional({ description: 'Filter by SKU code (partial match)' })
  @IsOptional()
  @IsString()
  skuCode?: string;

  @ApiPropertyOptional({ description: 'Filter by item name (partial match)' })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({ description: 'Filter by category (partial match)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by brand (partial match)' })
  @IsOptional()
  @IsString()
  brand?: string;
}
