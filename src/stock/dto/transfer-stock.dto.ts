import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferStockDto {
  @ApiProperty({ description: 'Source location (branch) ID' })
  @IsString()
  @IsNotEmpty()
  sourceLocation: string;

  @ApiProperty({ description: 'Destination location (branch) ID' })
  @IsString()
  @IsNotEmpty()
  destinationLocation: string;

  @ApiProperty({ description: 'SKU ID to transfer' })
  @IsString()
  @IsNotEmpty()
  skuId: string;

  @ApiProperty({ description: 'Quantity to transfer (positive number)' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
