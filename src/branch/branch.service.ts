import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from './branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  async create(createDto: CreateBranchDto): Promise<Branch> {
    const created = new this.branchModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) throw new NotFoundException(`Branch #${id} not found`);
    return branch;
  }

  async update(id: string, updateDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.branchModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .exec();
    if (!branch) throw new NotFoundException(`Branch #${id} not found`);
    return branch;
  }

  async remove(id: string): Promise<void> {
    await this.branchModel.findByIdAndDelete(id).exec();
  }
}
