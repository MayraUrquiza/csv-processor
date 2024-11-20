import { Command, CommandRunner } from 'nest-commander';
import { CsvService } from './csv.service';

@Command({
  name: 'process-csv',
  description: 'transform csv with json columns in a plain structure',
  options: { isDefault: true },
})
export class CsvCommand extends CommandRunner {
  constructor(private readonly csvService: CsvService) {
    super();
  }

  async run(parameters: string[]) {
    console.log('input file:', parameters[0]);
    console.log('output file:', parameters[1]);

    const [input, output] = parameters;

    if (!input || !output) {
      throw new Error(
        'Debe proporcionar un archivo csv de entrada y otro de salida\n',
      );
    }

    await this.csvService.processCsv(input, output);
  }
}
