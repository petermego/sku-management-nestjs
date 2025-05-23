import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchModule } from './branch/branch.module';
import { SkuModule } from './sku/sku.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION as string),
    BranchModule,
    SkuModule,
  ],
  providers: [],
})
export class AppModule {}
