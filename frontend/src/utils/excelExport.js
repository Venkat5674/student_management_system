import * as xlsx from 'xlsx';

export const exportToExcel = (data, filename = 'students.xlsx') => {
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Students");
  xlsx.writeFile(wb, filename);
};
