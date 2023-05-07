module.exports = {
    buttons: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Додати виклик', callback_data: '/add'}],
                [{text: 'Список викликік', callback_data: '/list'}],
                [{text: 'Редагувати виклик', callback_data: 'edit'},{text: 'Видалити виклик', callback_data: '/delete'}],
                [{text: 'Вивантажити виклики за поточний місяць', callback_data: '/download'}],
                [{text: 'Налаштування', callback_data: '/settings'}],
                [{text: 'Завершити роботу з ботом', callback_data: '/close'}]
            ]
        })
    }
}