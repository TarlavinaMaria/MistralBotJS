require('dotenv').config();
const { Mistral } = require('@mistralai/mistralai');
const readline = require('readline');

// Загружаем API ключ из переменных окружения
const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  // Проверяет, что API ключ установлен
  console.error('API key is not set. Please check your .env file.');
  process.exit(1);
}

const client = new Mistral({ apiKey: apiKey }); // Создаем экземпляр Mistral с API ключом

const rl = readline.createInterface({
  // Создает интерфейс ввода/вывода с использованием модуля readline, который будет использоваться для взаимодействия с пользователем в консоли.
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  // Асинхронная функция, которая принимает вопрос пользователя и отправляет его на сервер Mistral AI
  try {
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: 'user', content: question }]
    });
    return chatResponse.choices[0].message.content; // Отправляет запрос к API Mistral AI с использованием модели mistral-large-latest и возвращает ответ.
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, something went wrong.';
  }
}

function startChatBot() {
  // Функция, которая запускает интерфейс ввода/вывода и ожидает ввода от пользователя
  rl.question('You: ', async (question) => { // Задает вопрос пользователю и ожидает его ответа
    if (question.toLowerCase() === 'exit') { // Проверяет, если пользователь ввел команду "exit", чтобы выйти из чат-бота
      rl.close();
      return;
    }
    // Отправляет вопрос на сервер Mistral AI и выводит ответ в консоль
    const answer = await askQuestion(question);
    console.log('ChatBot:', answer);
    // Рекурсивно вызывает startChatBot(), чтобы продолжить взаимодействие с пользователем.
    startChatBot();
  });
}

console.log('Welcome to the ChatBot! Type "exit" to quit.');
startChatBot();
