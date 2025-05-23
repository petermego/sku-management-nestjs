import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Branch } from '../branch/branch.schema';

@Schema({ collection: 'skus' })
export class SKU extends Document {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true, unique: true })
  skuCode: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ type: Types.ObjectId, ref: Branch.name, required: true })
  branch: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const SKUSchema = SchemaFactory.createForClass(SKU);
