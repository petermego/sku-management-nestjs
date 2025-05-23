import { ApiProperty } from '@nestjs/swagger';

export class DeactivateSkuDto {
  @ApiProperty({
    description: 'Confirmation message of deactivation',
    example: 'SKU deactivated successfully',
  })
  message: string;
}
