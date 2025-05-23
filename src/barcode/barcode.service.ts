import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SKU } from '../sku/sku.schema';
import bwipjs from 'bwip-js';
import * as QRCode from 'qrcode';
import { PNG } from 'pngjs';
import {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} from '@zxing/library';

@Injectable()
export class BarcodeService {
  constructor(@InjectModel(SKU.name) private readonly skuModel: Model<SKU>) {}

  async generateBarcode(skuCode: string): Promise<Buffer> {
    return bwipjs.toBuffer({
      bcid: 'code128',
      text: skuCode,
      scale: 3,
      height: 10,
      includetext: true,
    });
  }

  async generateQrCode(skuCode: string): Promise<Buffer> {
    return QRCode.toBuffer(skuCode, { type: 'png' });
  }

  private async loadPngData(buffer: Buffer): Promise<{
    data: Uint8ClampedArray;
    width: number;
    height: number;
  }> {
    return new Promise((resolve, reject) => {
      new PNG().parse(buffer, (err, png) => {
        if (err) return reject(err);
        const clamped = new Uint8ClampedArray(png.data);
        resolve({ data: clamped, width: png.width, height: png.height });
      });
    });
  }

  async decode(buffer: Buffer, formats: BarcodeFormat[]): Promise<string> {
    const img = await this.loadPngData(buffer);
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    const reader = new MultiFormatReader();
    reader.setHints(hints);
    const luminance = new RGBLuminanceSource(img.data, img.width, img.height);
    const bitmap = new BinaryBitmap(new HybridBinarizer(luminance));
    try {
      const result = reader.decode(bitmap);
      return result.getText();
    } catch {
      throw new NotFoundException('Code not recognized');
    }
  }

  async decodeQrCode(imageBuffer: Buffer): Promise<string> {
    return this.decode(imageBuffer, [BarcodeFormat.QR_CODE]);
  }

  async decodeBarcode(imageBuffer: Buffer): Promise<string> {
    return this.decode(imageBuffer, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
    ]);
  }

  async getSkuBarcodeById(id: string): Promise<Buffer> {
    const sku = await this.skuModel.findById(id).exec();
    if (!sku) throw new NotFoundException(`SKU #${id} not found`);
    return this.generateBarcode(sku.skuCode);
  }

  async getSkuQrById(id: string): Promise<Buffer> {
    const sku = await this.skuModel.findById(id).exec();
    if (!sku) throw new NotFoundException(`SKU #${id} not found`);
    return this.generateQrCode(sku.skuCode);
  }
}
