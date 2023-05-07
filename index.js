const {buttons} = require('./options.js');
const Calendar = require('telegram-inline-calendar');


const TelegramAPI = require('node-telegram-bot-api');
const axios = require("axios");
const token = '5899589110:AAFwsxjWwhzCUwzOfMP_o-25AnELV0GVMmI';


const buttons_settings = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '➕ Додати компанію ➕', callback_data: '/add_company'}],
            [{text: '📖 Список компаній 📖', callback_data: '/list_company'}],
            [{text: '🗑 Видалити компанію 🗑', callback_data: '/delete_company'}],
            [{text: '🏠 Перейти в головне меню 🏠', callback_data: '/back_main'}]
        ]
    })
}


const goToMainMenu = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '🏠 Перейти в головне меню 🏠', callback_data: '/goToMainMenu'}],
            [{text: '❌ Завершити чат ❌', callback_data: '/close'}],
        ]
    })
}

const buttonType = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Вирішення', callback_data: '/solution'}, {text: 'Консультація', callback_data: '/consultation'}]
        ]
    })
}

const buttonSource = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Telegram', callback_data: '/telegram'}, {text: 'Skype', callback_data: '/skype'}, {
                text: 'Jira',
                callback_data: '/jira'
            }]
        ]
    })
}

const bot = new TelegramAPI(token, {polling: true});

// const calendar = new Calendar(bot, {
//     date_format: 'MM-YYYY',
//     start_week_day: 1,
//     language: 'ru'
// });

let marker = '';

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

let company, type, source, description, link, date = '';
let data = '';

// bot.onText(/\/start/, (msg) => calendar.startNavCalendar(msg));

bot.on('message', async msg => {
    const text = msg.text;
    const chatID = msg.chat.id;

    if (text === '/start') {

        await bot.sendMessage(chatID, '👋');
        return bot.sendMessage(chatID, `Вітаю! ${msg.from.first_name} Це бот для опрацювання викликів.`, buttons);
    }

    if (text === '/close') {
        return bot.sendMessage(chatID, `${msg.from.first_name} роботу завершено!`);
    }

    if (text === '/info') {
        return bot.sendMessage(chatID, `Автор Волошин Іван.`);
    }

    if (text && marker === 'company' && text !== '/close') {
        company = msg.text;
        msg.text = null;
        marker = '';
        await bot.sendMessage(chatID, 'Виберіть тип:', buttonType);
        return marker = 'type';
    }

    if (text && marker === 'link') {
        link = msg.text;
        msg.text = null;
        marker = '';
        await bot.sendMessage(chatID, 'Ведіть опис:');
        return marker = 'description';
    }

    if (text && marker === 'add_company_text') {
        company = msg.text;
        await axios.post('https://tasker-webitel-default-rtdb.firebaseio.com/company.json', {
            company: company
        });
        marker = '';
    }


    if (data && marker === 'type') {
        marker = '';
        data = '';
        return marker = 'source';
    }

    if (data && marker === 'source') {
        msg.text = null;
        marker = '';
        data = '';
    }

    if (data && marker === 'description') {
        description = msg.text;
        await bot.sendMessage(chatID, 'Збережено');
        await bot.sendMessage(chatID, '🏠');
        await bot.sendMessage(chatID, 'Головне меню:', buttons);
        msg.text = null;
        marker = '';
        data = '';

        // return axios.post(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${msg.from.id}/tasks.json`, {
        return axios.post(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth()}/tasks.json`, {
            name: `${msg.from.first_name} ${msg.from.last_name}`,
            company: company,
            type: type,
            source: source,
            link: link,
            date: `${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay())}`,
            description: description
        });
    }
});

bot.on('callback_query', async msg => {
    data = msg.data;
    const chatID = msg.message.chat.id;

    // if (msg.message.message_id == calendar.chats.get(msg.message.chat.id)) {
    //     let res = calendar.clickButtonCalendar(msg);
    //     if (res !== -1) {
    //         bot.sendMessage(msg.message.chat.id, "You selected: " + res);
    //     }
    // }

    if (data === '/add') {
        await bot.sendMessage(chatID, 'Введіть назву компанії:');
        msg.text = null;
        return marker = 'company';
    }

    if (data === '/consultation') {
        await bot.sendMessage(chatID, 'Виберіть ресурс:', buttonSource);
        type = 'Консультація'
        return marker = 'type';
    }

    if (data === '/solution') {
        await bot.sendMessage(chatID, 'Виберіть ресурс:', buttonSource);
        type = 'Вирішення';
        return marker = 'type';
    }

    if (data === '/telegram') {
        await bot.sendMessage(chatID, 'Введіть опис:');
        source = 'Telegram'
        link = 'Telegram'
        return marker = 'description';
    }

    if (data === '/skype') {
        await bot.sendMessage(chatID, 'Введіть опис:');
        source = 'Skype'
        link = 'Skype'
        return marker = 'description';
    }

    if (data === '/jira') {
        await bot.sendMessage(chatID, 'Введіть посилання на таску:');
        msg.text = null;
        source = 'Jira';
        return marker = 'link';
    }

    if (data === '/goToMainMenu') {
        return bot.sendMessage(chatID, 'Головне меню:', buttons);
    }


    if (data === '/list') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;


        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth()}/tasks.json`).then(value => {
            listTask = value.data;
        });

        console.log(listTask)



        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                    listTaskStr = listTaskStr + `${index}. ${value?.company} - ${value?.type} - ${value?.source} - ${value?.link} - ${value?.description} - ${value.date}\n`
                    index++;
                }
            )
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
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
        await bot.sendMessage(chatID, '⚙️');
        return bot.sendMessage(chatID, 'Введіть тип налаштувань:', buttons_settings);
    }

    if (data === '/back_main') {
        return bot.sendMessage(chatID, 'Введіть тип налаштувань:', buttons);
    }

    if (data === '/close') {
        await bot.sendMessage(chatID, '✌️');
        return bot.sendMessage(chatID, 'Роботу завершено!');
    }
});

