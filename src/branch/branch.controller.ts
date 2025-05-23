import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './branch.schema';

@ApiTags('branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory branch' })
  @ApiResponse({
    status: 201,
    description: 'Branch created successfully',
    type: Branch,
  })
  create(@Body() dto: CreateBranchDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all inventory branches' })
  @ApiResponse({ status: 200, description: 'List of branches', type: [Branch] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch details', type: Branch })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing branch' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch updated', type: Branch })
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a branch' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({ status: 204, description: 'Branch deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
