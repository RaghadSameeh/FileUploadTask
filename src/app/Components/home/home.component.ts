import { Component } from '@angular/core';
import * as cheerio from 'cheerio';
import { DisplayService } from 'src/app/Services/display.service';
import { SaveDataService } from 'src/app/Services/save-data.service';


interface DataObject {
  keyword: string;
  key: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  dataFile:any;

  constructor(private saveDataService: SaveDataService,private getDataService:DisplayService) { 
  }


  uploadFile(event:Event) : void{

    const inputElement = event.target as HTMLInputElement;
    const file = (inputElement.files as FileList)[0];
    if (file){
      this.readFileContent(file);

    }
  }

  readFileContent(file: File): void {
    //create object to read content of the file
    const reader = new FileReader();

    //create the content of the file
    reader.readAsText(file);

    //executed when file reading is complete 
    reader.onload = (e: any) => {
      const htmlContent = e.target.result;
      this.parseHTML(htmlContent);

    };

}

parseHTML(htmlContent: string): void {
  const $ = cheerio.load(htmlContent);
  const dataObjects: DataObject[] = [];

  // Define the sections you want to process
  const sections = ['BalanceSheet', 'StatementOfIncome', 'StatementOfCashFlows'];

  // Iterate over each section
  sections.forEach(section => {
    // Find the parent div based on the section name
    const parentDiv = $(`div.${section}`);

    // Check if the parent div exists
    if (parentDiv.length > 0) {
      // Extract keyword from the first row of the parent table
      const keyword = parentDiv.find('tr.template-title td span.eng').text().trim();

      // Iterate over each child table within the parent div
      parentDiv.find('div.template-div table.gridtable').each((tableIndex, table) => {
        // Iterate over each row (skip the first row as it contains the keyword)
        $(table).find('tr').slice(1).each((rowIndex, row) => {
          // Extract key from the first column of the row
          const key = $(row).find('td:first-child span.eng').text().trim();

          // Extract value from the second column of the row
          const value = $(row).find('td:nth-child(2)').text().trim();

          // Add key-value pair to the object
          const dataObject: DataObject = { keyword, key, value };
          dataObjects.push(dataObject);
        });
      });
    }
  });

  // Log the extracted data
  console.log(dataObjects);

  this.saveDataService.save(dataObjects).subscribe((response)=>
  {
    console.log(response);

  },
  (error)=>{
    console.log(error);
  }
  ) 
}

//displayData
displaydata(value:any){
  const keyword = value.target.value;
  console.log(typeof(keyword));
  this.getDataService.getdata(keyword).subscribe((response:any) => {
    this.dataFile= response.data;
  },
  (error) => {
    console.log(error);
  })

}
}

