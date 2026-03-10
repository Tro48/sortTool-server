
declare namespace NodeJS {
  interface Process {
    /**
     * Поля, добавляемые пакером (pkg). Подправь интерфейс под ваши нужды.
     */
    pkg?: {
      entrypoint?: string;
      // добавь другие свойства если нужно
    };
  }
}
