import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkuController } from './sku.controller';
import { SkuService } from './sku.service';
import { SKU, SKUSchema } from './sku.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SKU.name, schema: SKUSchema }])],
  controllers: [SkuController],
  providers: [SkuService],
  exports: [SkuService],
})
export class SkuModule {}
