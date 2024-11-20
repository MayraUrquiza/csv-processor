import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as csvWriter from 'csv-write-stream';

@Injectable()
export class CsvService {
  async processCsv(inputFile: string, outputFile: string) {
    const results = [];

    await this.checkFileExists(inputFile);

    try {
      fs.createReadStream(inputFile)
        .pipe(
          csv({
            mapValues: ({ value }) => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value;
              }
            },
          }),
        )
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const plainObj = results.map((result) => this.getPlainObject(result));
          // grabar archivo output
          const writer = csvWriter();
          writer.pipe(fs.createWriteStream(outputFile));
          plainObj.forEach((entry) => {
            writer.write(entry);
          });
          writer.end();
        });
    } catch (error) {
      console.log(error.message);
      throw new Error('Error al formatear archivo');
    }
  }

  private checkFileExists(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject(new Error('El archivo no existe o no tienes permisos'));
        } else {
          resolve(true);
        }
      });
    });
  }

  private getPlainObject(obj, prefix = '') {
    const result = {};

    for (const property in obj) {
      const value = obj[property];
      const newKey = prefix ? `${prefix}.${property}` : property;

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((entry, index) => {
            Object.assign(
              result,
              this.getPlainObject(entry, `${newKey}[${index}]`),
            );
          });
        } else {
          Object.assign(result, this.getPlainObject(value, newKey));
        }
      } else {
        result[newKey] = value;
      }
    }

    return result;
  }
}
