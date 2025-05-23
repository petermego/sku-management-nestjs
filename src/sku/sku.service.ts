import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SKU } from './sku.schema';
import { CreateSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { SearchSkuDto } from './dto/search-sku.dto';

@Injectable()
export class SkuService {
  constructor(@InjectModel(SKU.name) private readonly skuModel: Model<SKU>) {}

  private generateSku(dto: CreateSkuDto): string {
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${dto.category.substring(0, 3).toUpperCase()}-${dto.subcategory.substring(0, 3).toUpperCase()}-${dto.brand.substring(0, 3).toUpperCase()}-${random}`;
  }

  async create(createDto: CreateSkuDto): Promise<SKU> {
    let code = createDto.skuCode;
    if (!code) {
      code = this.generateSku(createDto);
      while (await this.skuModel.exists({ skuCode: code })) {
        code = this.generateSku(createDto);
      }
    } else {
      if (await this.skuModel.exists({ skuCode: code })) {
        throw new ConflictException(`SKU code ${code} already exists`);
      }
    }
    const created = new this.skuModel({ ...createDto, skuCode: code });
    return created.save();
  }

  async findAll(): Promise<SKU[]> {
    return this.skuModel.find().populate('branch').exec();
  }

  async findOne(id: string): Promise<SKU> {
    const sku = await this.skuModel.findById(id).populate('branch').exec();
    if (!sku) throw new NotFoundException(`SKU #${id} not found`);
    return sku;
  }

  async update(id: string, updateDto: UpdateSkuDto): Promise<SKU> {
    const temp = { ...updateDto };
    const updated = await this.skuModel
      .findByIdAndUpdate(id, temp, { new: true })
      .populate('branch')
      .exec();
    if (!updated) {
      throw new NotFoundException(`SKU #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.skuModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`SKU #${id} not found`);
  }

  async search(filters: SearchSkuDto): Promise<SKU[]> {
    const query: Record<string, any> = {};
    if (filters && filters.skuCode) {
      query.skuCode = { $regex: filters.skuCode, $options: 'i' };
    }
    if (filters && filters.itemName) {
      query.itemName = { $regex: filters.itemName, $options: 'i' };
    }
    if (filters && filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }
    if (filters && filters.brand) {
      query.brand = { $regex: filters.brand, $options: 'i' };
    }
    return this.skuModel.find(query).populate('branch').exec();
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const sku = await this.skuModel.findById(id).exec();
    if (!sku) throw new NotFoundException(`SKU #${id} not found`);
    if (!sku.isActive) {
      return { message: 'SKU is already inactive' };
    }
    sku.isActive = false;
    await sku.save();
    return { message: 'SKU deactivated successfully' };
  }
}
