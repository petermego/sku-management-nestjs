/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { BarcodeService } from './barcode.service';
import { Request } from 'express';

@ApiTags('barcodes')
@Controller('barcodes')
export class BarcodeController {
  constructor(private readonly service: BarcodeService) {}

  @Get('/sku/:id/code128')
  @ApiOperation({ summary: 'Generate Code128 barcode for SKU' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({ status: 200, description: 'PNG image binary' })
  @Header('Content-Type', 'image/png')
  async getBarcode(@Param('id') id: string) {
    return this.service.getSkuBarcodeById(id);
  }

  @Get('/sku/:id/qrcode')
  @ApiOperation({ summary: 'Generate QR code for SKU' })
  @ApiParam({ name: 'id', description: 'SKU ID' })
  @ApiResponse({ status: 200, description: 'PNG image binary' })
  @Header('Content-Type', 'image/png')
  async getQrCode(@Param('id') id: string) {
    return this.service.getSkuQrById(id);
  }

  @Post('/scan')
  @ApiOperation({ summary: 'Scan uploaded image for barcode or QR code' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Decoded SKU string' })
  async scan(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { type: 'error', data: 'No file uploaded' };
    }
    const buf = file?.buffer;
    try {
      const data = await this.service.decodeQrCode(buf);
      return { type: 'qrcode', data };
    } catch {
      const data = await this.service.decodeBarcode(buf);
      return { type: 'barcode', data };
    }
  }
}
