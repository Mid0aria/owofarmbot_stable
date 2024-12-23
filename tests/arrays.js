/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

let tokens = ["31", "69", "123", "260", "90", "5"];
let userids = ["13", "96", "321", "062", "09", "2"];

function createClient(token, userid) {
    return {
        token: token,
        userid: userid,
        connect: function () {
            console.log(
                `Client created: Token -> ${this.token}, UserID -> ${this.userid}`,
            );
        },
    };
}

for (let i = 0; i < tokens.length; i++) {
    let client = createClient(tokens[i], userids[i]);
    client.connect();
}
