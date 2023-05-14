import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

interface CustomJSON2SheetOpts extends XLSX.JSON2SheetOpts {
  sheet_split?: string;
}

@Injectable()
export class ExcelService {

  constructor() { }


  public importFromExcelFile(bstr: string): any{
    /* read workbook */
    let jsonData;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    jsonData = wb.SheetNames.reduce((initial, name) => {
        const sheet = wb.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
    //const dataString = JSON.stringify(jsonData);

    /* save data */
    //const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    return jsonData;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    function flattenObject(obj, prefix = '') {
      return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
          acc[pre + key] = obj[key];
        }
        return acc;
      }, {});
    }
    
    function flattenObjectArray(objArray) {
      return objArray.map(obj => flattenObject(obj));
    }
    
    
    const flattenedArray = flattenObjectArray(json);
    console.log(flattenedArray);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedArray);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

  //   function flattenObject(obj, prefix = '') {
  //     return Object.keys(obj).reduce((acc, key) => {
  //       const pre = prefix.length ? prefix + '.' : '';
  //       if (typeof obj[key] === 'object' && obj[key] !== null) {
  //         return acc.concat(flattenObject(obj[key], pre + key));
  //       } else {
  //         return acc.concat(pre + key + ':' + obj[key]);
  //       }
  //     }, []);
  //   }
  //   const flatData = json.map(item => flattenObject(item));

  // const sheet = XLSX.utils.json_to_sheet(flatData, { sheet_split: ':' } as CustomJSON2SheetOpts);

  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
  // XLSX.writeFile(workbook, 'output.xlsx');
  }
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}