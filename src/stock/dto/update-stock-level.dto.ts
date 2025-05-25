import { PartialType } from '@nestjs/mapped-types';
import { StockLevelDto } from './stock-level.dto';

export class UpdateStockLevelDto extends PartialType(StockLevelDto) {}
