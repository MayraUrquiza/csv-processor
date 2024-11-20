import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvCommand } from './csv.command';

@Module({
  providers: [CsvService, CsvCommand],
})
export class CsvModule {}
