import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SkuService } from './sku.service';
import { CreateSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { SKU } from './sku.schema';
import { SearchSkuDto } from './dto/search-sku.dto';
import { DeactivateSkuDto } from './dto/deactivate-sku.dto';

@ApiTags('skus')
@Controller('skus')
export class SkuController {
  constructor(private readonly service: SkuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SKU' })
  @ApiResponse({
    status: 201,
    description: 'SKU created successfully',
    type: SKU,
  })
  create(@Body() dto: CreateSkuDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all SKUs' })
  @ApiResponse({ status: 200, description: 'List of SKUs', type: [SKU] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single SKU by ID' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({ status: 200, description: 'SKU details', type: SKU })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing SKU' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({ status: 200, description: 'SKU updated', type: SKU })
  update(@Param('id') id: string, @Body() dto: UpdateSkuDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SKU' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({ status: 204, description: 'SKU deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search SKUs by code, name, category, or brand' })
  @ApiResponse({ status: 200, description: 'Matching SKU list', type: [SKU] })
  search(@Query() filters: SearchSkuDto) {
    return this.service.search(filters);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a SKU (soft delete)' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({
    status: 200,
    description: 'Deactivation confirmation',
    type: DeactivateSkuDto,
  })
  deactivate(@Param('id') id: string): Promise<DeactivateSkuDto> {
    return this.service.deactivate(id);
  }
}
