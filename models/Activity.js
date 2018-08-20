//Name: Louisa Katlubeck
//Description: Create the model for the activity
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/,
// http://fredkschott.com/post/2014/01/node-js-cookbook---constructors-and-custom-types/,
// https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript/2559513#2559513,

class Activity {
    constructor(newActivity) {
        this.activity_id = newActivity.activity_id || null;
        this.name = newActivity.name || null;
        this.self = newActivity.self || null;
        this.type = newActivity.type || null;
        this.city_id = newActivity.city_id || null;
        this.visited = newActivity.visited || 0;
        this.user_id = newActivity.user_id || null;
    }
}

module.exports = Activity;