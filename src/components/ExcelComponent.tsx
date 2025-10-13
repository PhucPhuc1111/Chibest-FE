// Importing required libraries
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelHandler = () => {
  const [data, setData] = useState<string[][]>([]);

  // Handle file upload
  const handleFileUpload = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt.target) return;
        const ab = evt.target.result;
        const workbook = XLSX.read(ab, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(json as string[][]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle file export
  const handleFileExport = () => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };

  return (
    <div>
      <h1>Excel Import and Export Example</h1>
      
      {/* Upload Button */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      {/* Export Button */}
      <button onClick={handleFileExport}>Export to Excel</button>
      
      {/* Display the uploaded data */}
      <table>
        <thead>
          <tr>
            {data[0] && data[0].map((header:any, index:any) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelHandler;
