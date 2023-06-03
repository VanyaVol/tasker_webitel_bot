const {
    buttons, buttons_settings, buttonsGetMonth, monthButtons, goToMainMenu, buttonSource, buttonType, dateButton, buttonEditSelect
} = require('./options.js');

const xl = require('excel4node');
const TelegramAPI = require('node-telegram-bot-api');
const axios = require("axios");
const token = '5899589110:AAFwsxjWwhzCUwzOfMP_o-25AnELV0GVMmI';
const bot = new TelegramAPI(token, {polling: true});

let company, type, source, description, link, data, marker, numberEdit= '';

bot.setMyCommands([
    {command: '/start', description: 'Запустити бота'},
    {command: '/info', description: 'Інформація про бота'},
    {command: '/close', description: 'Завершити роботу з ботом'}]);

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

    if (text && marker === 'inputDate') {
        await bot.sendMessage(chatID, 'Збережено');
        await bot.sendMessage(chatID, '🏠');
        await bot.sendMessage(chatID, 'Головне меню:', buttons);

        marker = '';
        data = '';

        await axios.post(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`, {
            name: `${msg.from.first_name} ${msg.from.last_name}`,
            company: company,
            type: type,
            source: source,
            link: link,
            date: `${msg.text}`,
            description: description
        });
        return msg.text = null;
    }

    if (text && marker === 'delete_number') {
        let listTask = {};
        let index = 1;

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`).then(value => {
            listTask = value.data;
        });

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
        await bot.sendMessage(chatID, 'Виберіть дату:', dateButton);
        description = msg.text;
        msg.text = null;
        marker = '';
        data = '';
    }

    if (text && marker === 'edit_number') {
        numberEdit = msg.text;
        return bot.sendMessage(chatID, 'Виберіть, що ви хочете відредагувати:', buttonEditSelect);
    }
});

bot.on('callback_query', async msg => {
    const chatID = msg.message.chat.id;
    data = msg.data;
    let listMonth = async (numMonth) => {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;
        marker = '';

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${numMonth}/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n\n`;
                index++;
            })
            return bot.sendMessage(chatID, listTaskStr, goToMainMenu);
        } else {
            return bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }
    }

    let deleteMonth = async (numMonth) => {
        let listTaskStr = '';
        let listTask = {};
        let index = 1;

        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${numMonth}/tasks.json`).then(value => {
            listTask = value.data;
        });

        if (listTask) {
            await bot.sendMessage(chatID, '📖');
            await bot.sendMessage(chatID, 'Список всіх викликів:');
            Object.values(listTask).map((value) => {
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n\n`;
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

    let editMonth = async (numMonth) => {
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
                listTaskStr = listTaskStr + `${index}. ${value.company} - ${value.description} - ${value.source} - ${value.type} - ${value.link} - ${value.date}\n\n`;
                index++;
            })
            await bot.sendMessage(chatID, listTaskStr);
        } else {
            await bot.sendMessage(chatID, 'Список пустий... Спрочатку додайте виклики.', goToMainMenu);
        }

        await bot.sendMessage(chatID, 'Вкажіть порядковий номер виклику, який потрібно редагувати:');
        msg.text = null;
        return marker = 'edit_number';
    }

    if (data === '/delete') {
        marker = 'delete';
        return bot.sendMessage(chatID, 'Виберіть за який період:', buttonsGetMonth);
    }

    if (data === '/currentDate') {
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

        marker = '';

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

    if (data === '/inputDate') {
        await bot.sendMessage(chatID, 'Введіть дату в форматі "01.01.2023":');
        return marker = 'inputDate';
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
        marker = 'list';
        return bot.sendMessage(chatID, 'Виберіть місяць:', buttonsGetMonth);
    }

    if (data === '/current_month' && marker === 'delete') {
        return deleteMonth(new Date().getMonth() + 1);
    }

    if (data === '/select_month' && marker === 'delete') {
        return bot.sendMessage(chatID, 'Виберіть місяць:', monthButtons);
    }

    if (data === '/select_month') {
        return bot.sendMessage(chatID, 'Виберіть місяць:', monthButtons);
    }

    if (data === '/edit') {
        marker = 'edit';
        return bot.sendMessage(chatID, 'Виберіть за який період:', buttonsGetMonth);
    }

    if (data === '/current_month' && marker === 'edit') {
       return editMonth(new Date().getDate()+1);
    }

    if (data === '/current_month' && marker === 'list') {
        return listMonth(new Date().getMonth() + 1);
    }

    if (data === '/month_1' && marker === 'delete') {
        return deleteMonth(1);
    }

    if (data === '/month_2' && marker === 'delete') {
        return deleteMonth(2);
    }

    if (data === '/month_3' && marker === 'delete') {
        return deleteMonth(3);
    }

    if (data === '/month_4' && marker === 'delete') {
        return deleteMonth(4);
    }

    if (data === '/month_5' && marker === 'delete') {
        return deleteMonth(5);
    }

    if (data === '/month_6' && marker === 'delete') {
        return deleteMonth(6);
    }

    if (data === '/month_7' && marker === 'delete') {
        return deleteMonth(7);
    }

    if (data === '/month_8' && marker === 'delete') {
        return deleteMonth(8);
    }

    if (data === '/month_9' && marker === 'delete') {
        return deleteMonth(9);
    }

    if (data === '/month_10' && marker === 'delete') {
        return deleteMonth(10);
    }

    if (data === '/month_11' && marker === 'delete') {
        return deleteMonth(11);
    }

    if (data === '/month_12' && marker === 'delete') {
        return deleteMonth(12);
    }

    if (data === '/month_1' && marker === 'list') {
        return listMonth(1);
    }

    if (data === '/month_2' && marker === 'list') {
        return listMonth(2);
    }

    if (data === '/month_3' && marker === 'list') {
        return listMonth(3);
    }

    if (data === '/month_4' && marker === 'list') {
        return listMonth(4);
    }

    if (data === '/month_5' && marker === 'list') {
        return listMonth(5);
    }

    if (data === '/month_6' && marker === 'list') {
        return listMonth(6);
    }

    if (data === '/month_7' && marker === 'list') {
        return listMonth(7);
    }

    if (data === '/month_8' && marker === 'list') {
        return listMonth(8);
    }

    if (data === '/month_9' && marker === 'list') {
        return listMonth(9);
    }

    if (data === '/month_10' && marker === 'list') {
        return listMonth(10);
    }

    if (data === '/month_11' && marker === 'list') {
        return listMonth(11);
    }

    if (data === '/month_12' && marker === 'list') {
        return listMonth(12);
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

    if (data === '/download') {
        const wb = new xl.Workbook();
        const headingColumnNames = [
            "№",
            "Організація",
            "Опис",
            "Посилання",
            "Тип",
            "Джерело",
            "Дата",
        ];

        let index = 1;
        let headingColumnIndex = 1;
        let rowIndex = 2;
        let listTask = {};
        let export_data = [];
        let ws = wb.addWorksheet('Виклики');

        await bot.sendMessage(chatID, 'Файл');
        await axios.get(`https://tasker-webitel-default-rtdb.firebaseio.com/users/${+msg.from.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/tasks.json`).then(value => {
            listTask = value.data;
        });

        Object.values(listTask).map((value) => {
            export_data.push({
                id: index.toString(),
                company: value.company,
                description: value.description,
                link: value.link,
                type: value.type,
                source: value.source,
                date: value.date
            });
            index++;
        });

        await headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading)
        });

        await export_data.forEach(record => {
            let columnIndex = 1;
            Object.keys(record).forEach(columnName => {
                ws.cell(rowIndex, columnIndex++)
                    .string(record [columnName])
            });
            rowIndex++;
        });

        await wb.write(`Виклики ${msg.from.first_name} ${msg.from.last_name}.xlsx`);

        setTimeout(() => {
            bot.sendDocument(chatID, `Виклики ${msg.from.first_name} ${msg.from.last_name}.xlsx`);
        }, 2000);

        setTimeout(() => {
            bot.sendMessage(chatID, 'Готово', goToMainMenu);
        }, 2500);
    }

    if (data === '/back_main') {
        return bot.sendMessage(chatID, 'Введіть тип налаштувань:', buttons);
    }

    if (data === '/close') {
        await bot.sendMessage(chatID, '✌️');
        return bot.sendMessage(chatID, 'Роботу завершено!');
    }
});