module.exports = {
    buttons: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Додати виклик ➕', callback_data: '/add'}], [{
                text: 'Список викликів 📖', callback_data: '/list'
            }], [{text: 'Редагувати виклик 🖊', callback_data: '/edit'}, {
                text: 'Видалити виклик 🗑', callback_data: '/delete'
            }], [{
                text: 'Вивантажити виклики ⬇️', callback_data: '/download'
            }], // [{text: 'Налаштування ⚙️', callback_data: '/settings'}],
                [{
                    text: 'Завершити роботу ❌', callback_data: '/close'
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
                text: 'За поточний місяць 🗓', callback_data: '/current_month'
            }], [{text: 'Вибрати місяць ✔️', callback_data: '/select_month'}], [{
                text: 'Перейти в головне меню 🏠', callback_data: '/back_main'
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
                text: 'Перейти в головне меню 🏠', callback_data: '/goToMainMenu'
            }], [{text: 'Завершити роботу ❌', callback_data: '/close'}],]
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
                {text: 'Назву компанії', callback_data: '/nameCompanyEdit'},
                {text: 'Тип', callback_data: '/typeCompanyEdit'}
            ],
                [
                    {text: 'Опис', callback_data: '/descriptionCompanyEdit'},
                    {text: 'Джерело', callback_data: '/sourceCompanyEdit'},
                    {text: 'Дату', callback_data: '/dateCompanyEdit'}
                ]]
        })
    },
    numbers: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                {text: '1', callback_data: '/1'},
                {text: '2', callback_data: '/2'},
                {text: '3', callback_data: '/3'},
                {text: '4', callback_data: '/4'},
                {text: '5', callback_data: '/5'},
                {text: '6', callback_data: '/6'}
            ],
                [
                    {text: '7', callback_data: '/7'},
                    {text: '8', callback_data: '/8'},
                    {text: '9', callback_data: '/9'},
                    {text: '10', callback_data: '/11'},
                    {text: '11', callback_data: '/12'},
                    {text: '12', callback_data: '/13'}
                ],
                [
                    {text: '13', callback_data: '/13'},
                    {text: '14', callback_data: '/14'},
                    {text: '15', callback_data: '/15'},
                    {text: '16', callback_data: '/16'},
                    {text: '17', callback_data: '/17'},
                    {text: '18', callback_data: '/18'}
                ],
                [
                    {text: '19', callback_data: '/19'},
                    {text: '20', callback_data: '/20'},
                    {text: '21', callback_data: '/21'},
                    {text: '22', callback_data: '/22'},
                    {text: '23', callback_data: '/23'},
                    {text: '24', callback_data: '/24'}
                ],
                [
                    {text: '25', callback_data: '/25'},
                    {text: '26', callback_data: '/26'},
                    {text: '27', callback_data: '/27'}
                ]
            ]
        })
    }
}