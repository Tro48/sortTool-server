import { writeFile } from 'node:fs/promises';

export function delayedClear(filePath:string, delayMs:number) {
  setTimeout(async () => {
    try {
      await writeFile(filePath, JSON.stringify({}), 'utf8');
      console.log(`\n[System] Файл ${filePath} успешно очищен.`);
    } catch (err) {
      console.error('[Error] Ошибка при очистке файла:', err);
    }
  }, delayMs);
}
