import { RecordItem } from '../types';

const STORAGE_KEY = 'lulu_app_data';

export const loadRecords = (): RecordItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const saveRecords = (records: RecordItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save records", e);
    alert("存储空间不足，可能无法保存所有数据，请尝试清理图片。");
  }
};

export const exportData = () => {
  const records = loadRecords();
  const dataStr = JSON.stringify(records, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lulu_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCSV = () => {
  const records = loadRecords();
  if (records.length === 0) {
    alert("没有数据可导出");
    return;
  }

  // CSV Header
  const headers = ['ID', 'Date', 'Title', 'Category', 'Content', 'ImageURL'];
  const csvContent = [
    headers.join(','),
    ...records.map(r => {
      const row = [
        r.id,
        new Date(r.date).toISOString(),
        `"${r.title.replace(/"/g, '""')}"`, // Escape quotes
        r.category,
        `"${r.content.replace(/"/g, '""')}"`, // Escape quotes in content
        r.image ? `"${r.image.substring(0, 50)}..."` : '' // Truncate image base64 for CSV to avoid massive files, usually CSV links to files
      ];
      return row.join(',');
    })
  ].join('\n');

  // Add BOM for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lulu_records_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const records = JSON.parse(json);
        if (Array.isArray(records)) {
          saveRecords(records);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.error("Import failed", err);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};