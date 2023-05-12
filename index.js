const {buttons} = require('./options.js');
const Calendar = require('telegram-inline-calendar');


const TelegramAPI = require('node-telegram-bot-api');
const axios = require("axios");
const token = '5899589110:AAFwsxjWwhzCUwzOfMP_o-25AnELV0GVMmI';


const buttons_settings = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{
            text: '➕ Додати компанію ➕',
            callback_data: '/add_company'
        }], [{text: '📖 Список компаній 📖', callback_data: '/list_company'}], [{
            text: '🗑 Видалити компанію 🗑',
            callback_data: '/delete_company'
        }], [{text: '🏠 Перейти в головне меню 🏠', callback_data: '/back_main'}]]
    })
}

const buttonsGetMonth = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{
            text: '🗓 Показати за поточний місяць 🗓',
            callback_data: '/current_month'
        }], [{text: '✔️ Вибрати місяць ✔️', callback_data: '/select_month'}], [{
            text: '🏠 Перейти в головне меню 🏠',
            callback_data: '/back_main'
        }]]
    })
}

const monthButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Січень', callback_data: '/month_1'}, {text: 'Лютий', callback_data: '/month_2'}, {
            text: 'Березень', callback_data: '/month_3'
        }, {text: 'Квітень', callback_data: '/month_4'}], [{text: 'Травень', callback_data: '/month_5'}, {
            text: 'Червень', callback_data: '/month_6'
        }, {text: 'Липень', callback_data: '/month_7'}, {
            text: 'Серпень',
            callback_data: '/month_8'
        }], [{text: 'Вересень', callback_data: '/month_9'}, {
            text: 'Жовтень', callback_data: '/month_10'
        }, {text: 'Листопад', callback_data: '/month_11'}, {text: 'Грудень', callback_data: '/month_12'}]]
    })
}


const goToMainMenu = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{
            text: '🏠 Перейти в головне меню 🏠',
            callback_data: '/goToMainMenu'
        }], [{text: '❌ Завершити чат ❌', callback_data: '/close'}],]
    })
}

const buttonType = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Вирішення', callback_data: '/solution'}, {
            text: 'Консультація',
            callback_data: '/consultation'
        }]]
    })
}

const buttonSource = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Telegram', callback_data: '/telegram'}, {text: 'Skype', callback_data: '/skype'}, {
            text: 'Jira', callback_data: '/jira'
        }]]
    })
}

const bot = new TelegramAPI(token, {polling: true});

// const calendar = new Calendar(bot, {
//     date_format: 'MM-YYYY',
//     start_week_day: 1,
//     language: 'ru'
// });

let marker = '';

bot.setMyCommands([{
    command: '/start',
    description: 'Запустити бота'
}, // {command: '/add', description: 'Додати виклик'},
    // {command: '/list', description: 'Список викликів'},
    // {command: '/edit', description: 'Редагувати виклик'},
    // {command: '/delete', description: 'Видалити виклик'},
    // {command: '/download', description: 'Завантажити список викликів за поточний місяць'},
    // {command: '/info', description: 'Інформація про бота'},
    {command: '/close', description: 'Завершити роботу з ботом'}]);

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


    if (text && marker === 'delete_number') {
        let listTask = {};
        let index = 1;

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`).then(value => {
            listTask = value.data;
        });

        // console.log(listTask);
        if (listTask) {

            for (const listTaskElement in listTask) {
                if (+index === +msg.text) {
                    await axios.delete(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks/${listTaskElement}.json`)
                }
                index++;
            }
        }

        return bot.sendMessage(chatID, 'Видалено!', goToMainMenu);
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

        let month = (new Date().getMonth() + 1);
        let day = (new Date().getDate());

        if (month.toString().length < 2) {
            month = `0${month}`;
        }

        if (day.toString().length < 2) {
            day = `0${day}`;
        }

        return axios.post(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`, {
            name: `${msg.from.first_name} ${msg.from.last_name}`,
            company: company,
            type: type,
            source: source,
            link: link,
            date: `${day}.${month}.${new Date().getFullYear()}`,
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

    if (data === '/delete') {
        marker = 'delete';
        return bot.sendMessage(chatID, 'Виберіть за який період:', buttonsGetMonth);
    }

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
        marker = '';

        await bot.sendMessage(chatID, 'Виберіть місяць:', buttonsGetMonth);

        // await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth()}/tasks.json`).then(value => {
        //     listTask = value.data;
        // });
        //
        // if (listTask) {
        //     await bot.sendMessage(chatID, '📖');
        //     await bot.sendMessage(chatID, 'Список всіх викликів:');
        //     Object.values(listTask).map((value) => {
        //             listTaskStr = listTaskStr + `${index}. ${value?.company} - ${value?.type} - ${value?.source} - ${value?.link} - ${value?.description} - ${value.date}\n`
        //             index++;
        //         }
        //     )
        //     return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        // } else {
        //     return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        // }
    }

    if (data === '/current_month' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value?.company} - ${value?.description} - ${value?.source} - ${value?.type} - ${value?.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            await bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/select_month' && marker === 'delete') {
        return bot.sendMessage(chatID, 'Виберіть місяць:', monthButtons);
    }


    if (data === '/current_month') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value?.company} - ${value?.description} - ${value?.source} - ${value?.type} - ${value?.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/select_month') {
        return bot.sendMessage(chatID, 'Виберіть місяць:', monthButtons);
    }


    if (data === '/month_1' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/1/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_2' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/2/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_3' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/3/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_4' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/4/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_5' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/5/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_6' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/4/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_7' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/7/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_8' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/8/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr,);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_9' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/9/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_10' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/10/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_11' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/11/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }

    if (data === '/month_12' && marker === 'delete') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/12/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно видалити:');
        msg.text = null;
        return marker = 'delete_number';
    }


    /// select delete
    if (data === '/month_1') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/1/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_2') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/2/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_3') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/3/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_4') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/4/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_5') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/5/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_6') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/4/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }


    if (data === '/month_7') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/7/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_8') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/8/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_9') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/9/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_10') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/10/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_11') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/11/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    if (data === '/month_12') {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/12/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n`
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    ////


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

