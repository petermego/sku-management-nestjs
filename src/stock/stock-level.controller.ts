import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StockLevelService } from './stock-level.service';
import { StockLevel } from './stock-level.schema';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { NotificationDto } from './dto/notification.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';

@ApiTags('stock-level')
@Controller('stock-level')
export class StockLevelController {
  constructor(private readonly service: StockLevelService) {}

  @Get(':skuCode')
  @ApiOperation({ summary: 'Get stock level for a SKU' })
  @ApiParam({ name: 'skuCode', description: 'SKU code to query' })
  @ApiResponse({
    status: 200,
    description: 'Stock level details',
    type: StockLevel,
  })
  getStock(@Param('skuCode') skuCode: string) {
    return this.service.getBySkuCode(skuCode);
  }

  @Patch(':skuCode')
  @ApiOperation({ summary: 'Update stock level for a SKU' })
  @ApiParam({ name: 'skuCode', description: 'SKU code to update' })
  @ApiResponse({
    status: 200,
    description: 'Updated stock level',
    type: StockLevel,
  })
  updateStock(
    @Param('skuCode') skuCode: string,
    @Body() dto: UpdateStockLevelDto,
  ) {
    return this.service.updateBySkuCode(skuCode, dto);
  }

  @Patch(':skuId/adjust')
  @ApiOperation({ summary: 'Adjust stock for a SKU' })
  @ApiParam({ name: 'skuId', description: 'SKU ID for adjustment' })
  @ApiResponse({
    status: 200,
    description: 'Adjusted stock level',
    type: StockLevel,
  })
  adjustStock(@Param('skuId') skuId: string, @Body() dto: AdjustStockDto) {
    return this.service.adjustStock(skuId, dto);
  }

  @Get(':skuCode/alert')
  @ApiOperation({ summary: 'Trigger alert if stock below threshold' })
  @ApiParam({ name: 'skuCode', description: 'SKU code to check' })
  @ApiQuery({
    name: 'reorderThreshold',
    required: false,
    description: 'Override threshold for this check',
  })
  @ApiResponse({
    status: 200,
    description: 'Alert notification object',
    type: NotificationDto,
  })
  alertStock(
    @Param('skuCode') skuCode: string,
    @Query('reorderThreshold') reorderThreshold?: number,
  ) {
    return this.service.alertThreshold(skuCode, reorderThreshold);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer stock between locations' })
  @ApiResponse({
    status: 200,
    description: 'Updated stock at both locations',
    type: Array<StockLevel>,
  })
  transfer(@Body() dto: TransferStockDto) {
    return this.service.transferStock(dto);
  }

  @Get(':skuId/branch/:branchId')
  @ApiOperation({ summary: 'Get stock level for a SKU at a specific branch' })
  @ApiParam({ name: 'skuId', description: 'SKU ID to query' })
  @ApiParam({ name: 'branchId', description: 'Branch ID to query' })
  @ApiResponse({
    status: 200,
    description: 'Stock level details',
    type: StockLevel,
  })
  getStockByLocation(
    @Param('skuId') skuId: string,
    @Param('branchId') branchId: string,
  ) {
    return this.service.getBySkuAndLocation(skuId, branchId);
  }
}
