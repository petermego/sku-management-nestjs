import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'branches' })
export class Branch extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, type: String })
  contactDetails: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
