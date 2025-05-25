import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SKU } from '../sku/sku.schema';
import { Branch } from 'src/branch/branch.schema';

@Schema({ collection: 'stock_levels' })
export class StockLevel extends Document {
  @Prop({ type: Types.ObjectId, ref: SKU.name, unique: true, required: true })
  sku: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Branch.name, required: true })
  location: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  currentQuantity: number;

  @Prop({ type: Number, default: 0 })
  reservedQuantity: number;

  @Prop({ type: Number, default: 0 })
  reorderThreshold: number;
}

export const StockLevelSchema = SchemaFactory.createForClass(StockLevel);
StockLevelSchema.index({ sku: 1, location: 1 }, { unique: true });
