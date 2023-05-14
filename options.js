module.exports = {
    buttons: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: '➕ Додати виклик ➕', callback_data: '/add'}], [{
                text: '📖 Список викликів 📖', callback_data: '/list'
            }], [{text: '🖊 Редагувати виклик 🖊', callback_data: '/edit'}, {
                text: '🗑 Видалити виклик 🗑', callback_data: '/delete'
            }], [{
                text: '⬇️ Вивантажити виклики за поточний місяць ⬇️', callback_data: '/download'
            }], // [{text: '⚙️ Налаштування ⚙️', callback_data: '/settings'}],
                [{
                    text: '❌ Завершити роботу з ботом ❌', callback_data: '/close'
                }]]
        })
    }, buttons_settings: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: '➕ Додати компанію ➕', callback_data: '/add_company'
            }], [{text: '📖 Список компаній 📖', callback_data: '/list_company'}], [{
                text: '🗑 Видалити компанію 🗑', callback_data: '/delete_company'
            }], [{text: '🏠 Перейти в головне меню 🏠', callback_data: '/back_main'}]]
        })
    }, buttonsGetMonth: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: '🗓 Показати за поточний місяць 🗓', callback_data: '/current_month'
            }], [{text: '✔️ Вибрати місяць ✔️', callback_data: '/select_month'}], [{
                text: '🏠 Перейти в головне меню 🏠', callback_data: '/back_main'
            }]]
        })
    }, monthButtons: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Січень', callback_data: '/month_1'}, {
                text: 'Лютий', callback_data: '/month_2'
            }, {
                text: 'Березень', callback_data: '/month_3'
            }, {text: 'Квітень', callback_data: '/month_4'}], [{text: 'Травень', callback_data: '/month_5'}, {
                text: 'Червень', callback_data: '/month_6'
            }, {text: 'Липень', callback_data: '/month_7'}, {
                text: 'Серпень', callback_data: '/month_8'
            }], [{text: 'Вересень', callback_data: '/month_9'}, {
                text: 'Жовтень', callback_data: '/month_10'
            }, {text: 'Листопад', callback_data: '/month_11'}, {text: 'Грудень', callback_data: '/month_12'}]]
        })
    }, goToMainMenu: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: '🏠 Перейти в головне меню 🏠', callback_data: '/goToMainMenu'
            }], [{text: '❌ Завершити чат ❌', callback_data: '/close'}],]
        })
    }, dateButton: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: 'Поточна дата', callback_data: '/currentDate'
            }, {text: 'Ввести дату вручну', callback_data: '/inputDate'}]]
        })
    }, buttonType: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Вирішення', callback_data: '/solution'}, {
                text: 'Консультація', callback_data: '/consultation'
            }]]
        })
    }, buttonSource: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Telegram', callback_data: '/telegram'}, {
                text: 'Skype', callback_data: '/skype'
            }, {
                text: 'Jira', callback_data: '/jira'
            }]]
        })
    },
    buttonEditSelect: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                {text: 'Назву компанії', callback_data: '/nameCompany'},
                {text: 'Назву компанії', callback_data: '/nameCompany'},
                {text: 'Назву компанії', callback_data: '/nameCompany'},
                {text: 'Назву компанії', callback_data: '/nameCompany'},
                {text: 'Опис', callback_data: '/consultation'}
            ]]
        })
    }
}