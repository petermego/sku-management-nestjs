import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({
    description: 'Adjustment quantity (positive or negative)',
    example: -5,
  })
  @IsNumber()
  adjustmentQuantity: number;

  @ApiProperty({
    description: 'Reason for adjustment',
    example: 'Damaged items',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
