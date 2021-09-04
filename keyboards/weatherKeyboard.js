const weatherKeyboard = {reply_markup: 
    {keyboard: [ 
        [{text: 'Екатеринбург'},{text:'Сочи'}, {text:'Кемер'}],
        // [],
        // [],
        [{text:' \ud83c\udfe0 WRITE YOUR CITY! \ud83c\udfe0	'}]
    ], one_time_keyboard: true, resize_keyboard: true, remove_keyboard: true}
}

export default weatherKeyboard;