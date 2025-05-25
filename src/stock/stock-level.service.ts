import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockLevel } from './stock-level.schema';
import { SKU } from '../sku/sku.schema';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { NotificationDto } from './dto/notification.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';

@Injectable()
export class StockLevelService {
  constructor(
    @InjectModel(StockLevel.name)
    private readonly stockModel: Model<StockLevel>,
    @InjectModel(SKU.name) private readonly skuModel: Model<SKU>,
  ) {}

  async getBySkuCode(skuCode: string): Promise<StockLevel> {
    const sku = await this.skuModel.findOne({ skuCode }).exec();
    if (!sku) throw new NotFoundException(`SKU code ${skuCode} not found`);
    let stock = await this.stockModel.findOne({ sku: sku._id }).exec();
    if (!stock) {
      stock = await this.stockModel.create({ sku: sku._id });
    }
    return stock;
  }

  async updateBySkuCode(
    skuCode: string,
    updateDto: UpdateStockLevelDto,
  ): Promise<StockLevel> {
    const sku = await this.skuModel.findOne({ skuCode }).exec();
    if (!sku) throw new NotFoundException(`SKU code ${skuCode} not found`);
    const stock = await this.stockModel
      .findOneAndUpdate(
        { sku: sku._id },
        { ...updateDto },
        { new: true, upsert: true, runValidators: true },
      )
      .exec();
    return stock;
  }

  async adjustStock(
    skuId: string,
    adjustDto: AdjustStockDto,
  ): Promise<StockLevel> {
    const stock = await this.stockModel.findOne({ sku: skuId }).exec();
    if (!stock)
      throw new NotFoundException(`Stock entry for SKU ${skuId} not found`);
    stock.currentQuantity += adjustDto.adjustmentQuantity;
    await stock.save();
    return stock;
  }

  async alertThreshold(
    skuCode: string,
    overrideThreshold?: number,
  ): Promise<NotificationDto> {
    const stock = await this.getBySkuCode(skuCode);
    const threshold = overrideThreshold ?? stock.reorderThreshold;
    const current = stock.currentQuantity;
    const alert = current < threshold;
    const message = alert
      ? 'Stock below reorder threshold'
      : 'Stock level is sufficient';
    return { skuCode, currentQuantity: current, threshold, alert, message };
  }

  async transferStock(
    transferDto: TransferStockDto,
  ): Promise<{ source: StockLevel; destination: StockLevel }> {
    const { sourceLocation, destinationLocation, skuId, quantity } =
      transferDto;
    const sku = await this.skuModel.findById(skuId).exec();
    if (!sku) throw new NotFoundException(`SKU #${skuId} not found`);

    const sourceStock = await this.stockModel
      .findOne({ sku: sku._id, location: sourceLocation })
      .exec();
    if (!sourceStock)
      throw new NotFoundException(
        `Source location stock for SKU #${skuId} not found`,
      );
    if (sourceStock.currentQuantity < quantity) {
      throw new BadRequestException('Insufficient stock at source location');
    }

    let destStock = await this.stockModel
      .findOne({ sku: sku._id, location: destinationLocation })
      .exec();
    if (!destStock) {
      destStock = new this.stockModel({
        sku: sku._id,
        location: destinationLocation,
        currentQuantity: 0,
      });
    }

    sourceStock.currentQuantity -= quantity;
    destStock.currentQuantity += quantity;

    await sourceStock.save();
    await destStock.save();

    return { source: sourceStock, destination: destStock };
  }

  async getBySkuAndLocation(
    skuId: string,
    branchId: string,
  ): Promise<StockLevel> {
    const stock = await this.stockModel
      .findOne({ sku: skuId, location: branchId })
      .exec();
    if (!stock) {
      throw new NotFoundException(
        `Stock entry for SKU #${skuId} at branch #${branchId} not found`,
      );
    }
    return stock;
  }
}
