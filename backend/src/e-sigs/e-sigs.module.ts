import { Module } from '@nestjs/common';
import { ESigsService } from './e-sigs.service';
import { ESigsController } from './e-sigs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESig } from './entities/e-sig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ESig])],
  controllers: [ESigsController],
  providers: [ESigsService],
})
export class ESigsModule {}
