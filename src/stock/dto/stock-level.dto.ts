import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class StockLevelDto {
  @ApiProperty({ description: 'SKU code to track', example: 'ABC-XYZ-1234' })
  @IsString()
  @IsNotEmpty()
  skuCode: string;

  @ApiProperty({
    description: 'Current available stock',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentQuantity?: number;

  @ApiProperty({
    description: 'Reserved stock quantity',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @ApiProperty({
    description: 'Reorder threshold level',
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderThreshold?: number;
}
