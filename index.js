const {buttons} = require('./options.js');


const TelegramAPI = require('node-telegram-bot-api');
const axios = require("axios");
const token = '5899589110:AAHGRgtbaBUPNuOykVrnWA1Pw-iduYvOOgs';


const buttons_settings = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Додати компанію', callback_data: '/add_company'}],
            [{text: 'Список компаній', callback_data: '/list_company'}],
            [{text: 'Видалити компанію', callback_data: '/delete_company'}],
            [{text: 'Назад', callback_data: '/back_main'}]
        ]
    })
}


const goToMainMenu = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Перейти в головне меню', callback_data: '/goToMainMenu'}],
            [{text: 'Завершити чат', callback_data: '/close'}],
        ]
    })
}


const bot = new TelegramAPI(token, {polling: true});

let marker = '';
let dataGlobal = '';

bot.setMyCommands([
    {command: '/start', description: 'Запустити бота'},
    // {command: '/add', description: 'Додати виклик'},
    // {command: '/list', description: 'Список викликів'},
    // {command: '/edit', description: 'Редагувати виклик'},
    // {command: '/delete', description: 'Видалити виклик'},
    // {command: '/download', description: 'Завантажити список викликів за поточний місяць'},
    // {command: '/info', description: 'Інформація про бота'},
    {command: '/close', description: 'Завершити роботу з ботом'}
]);

let company, type, source, description, link = '';


bot.on('message', async msg => {
    const text = msg.text;
    const chatID = msg.chat.id;

    if (text && marker === 'company') {
        company = msg.text;
        await bot.sendMessage(chatID, 'Введіть тип:');
        msg.text = null;
        return marker = 'type';
    }

    if (text && marker === 'add_company_text') {
        company = msg.text;
        await axios.post('https://tasker-webitel-default-rtdb.firebaseio.com/company.json', {
            company: company
        });
        marker = '';
    }

    if (text && marker === 'type') {
        type = msg.text;
        await bot.sendMessage(chatID, 'Готово!:', buttons);
        msg.text = null;
        marker = '';
        return axios.post('https://tasker-webitel-default-rtdb.firebaseio.com/tasks.json', {
            name: `${msg.from.first_name}`,
            company: company,
            type: type
        });
    }

    if (text === '/start') {
        return bot.sendMessage(chatID, `Вітаю! ${msg.from.first_name} Це бот для опрацювання викликів.`, buttons);
    }

    if (text === '/close') {
        return bot.sendMessage(chatID, `${msg.from.first_name} роботу завершено!`);
    }

    if (text === '/info') {
        return bot.sendMessage(chatID, `Автор Волошин Іван.`);
    }
});

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatID = msg.message.chat.id;

    if (data === '/add') {
        await bot.sendMessage(chatID, 'Введіть назву компанії:');
        return marker = 'company';
    }

    if (data === '/goToMainMenu') {
        return bot.sendMessage(chatID, 'Головне меню:', buttons);
    }

    if (data === '/add_company') {
        company = '';
        await bot.sendMessage(chatID, 'Введіть назву компанії:');
        msg.message.text = null;
        marker = 'add_company_text';
    }

    if (data === '/list_company') {
        let listCompanyStr = '';
        let listCompany = {};
        await axios.get('https://tasker-webitel-default-rtdb.firebaseio.com/company.json').then(value => listCompany = value.data);
        await bot.sendMessage(chatID, 'Список всіх компаній:')
        Object.values(listCompany).map((value, index) => listCompanyStr = listCompanyStr + (index + 1) + '. ' + value.company + '\n');
        return bot.sendMessage(chatID, listCompanyStr, goToMainMenu);
    }

    if (data === '/settings') {
        return bot.sendMessage(chatID, 'Введіть тип налаштувань:', buttons_settings);
    }

    if (data === '/back_main') {
        return bot.sendMessage(chatID, 'Введіть тип налаштувань:', buttons);
    }

    if (data === '/close') {
        return bot.sendMessage(chatID, 'Роботу завершено!');
    }
});

