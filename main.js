const { app, BrowserWindow } = require('electron');
const path = require('path');



function createWindow() {
  // Створення вікна браузера.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true, // Дозволяємо використання Node.js
      contextIsolation: false // Відключаємо ізоляцію контексту для використання require
    }
  });

  // Завантаження index.html у вікно.
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  // Побудова шляху до CSS файлу
  const cssPath = path.join(__dirname, 'styles', 'main.css');
  console.log(cssPath); // Виведіть шлях до консолі для перевірки

  // Відкриття DevTools.
  mainWindow.webContents.openDevTools();
}

// Цей метод буде викликаний, коли Electron завершить
// ініціалізацію та готовий створювати вікна браузера.
// Деякі API можуть використовуватися лише після цього події.
app.whenReady().then(createWindow);

// Виходити з програми, коли всі вікна закриті,
// крім MacOS, де це звичайна поведінка.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // На MacOS звичайно створювати вікно в додатку,
  // коли клікають на іконку доку і жодних інших вікон відкрито не є.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
