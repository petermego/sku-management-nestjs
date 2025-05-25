import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockLevelController } from './stock-level.controller';
import { StockLevelService } from './stock-level.service';
import { StockLevel, StockLevelSchema } from './stock-level.schema';
import { SKU, SKUSchema } from '../sku/sku.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockLevel.name, schema: StockLevelSchema },
      { name: SKU.name, schema: SKUSchema },
    ]),
  ],
  controllers: [StockLevelController],
  providers: [StockLevelService],
})
export class StockLevelModule {}
