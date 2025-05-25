import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ description: 'SKU code', example: 'ABC-XYZ-1234' })
  skuCode: string;

  @ApiProperty({ description: 'Current stock quantity', example: 5 })
  currentQuantity: number;

  @ApiProperty({ description: 'Reorder threshold used', example: 10 })
  threshold: number;

  @ApiProperty({ description: 'Whether an alert was triggered' })
  alert: boolean;

  @ApiProperty({ description: 'Descriptive message about alert status' })
  message: string;
}
