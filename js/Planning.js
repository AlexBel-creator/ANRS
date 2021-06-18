// let nav = 0;
// let  clicked = null;
var date = new Date();
const week = ["D", "L", "M", "Me", "J", "V", "S"];

// Source : https://stackoverflow.com/questions/7708819/keep-only-first-n-characters-in-a-string
Date.prototype.addDays = function(days) {
    // Alows to add or substract days in the UI. 
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var date_year = [];

function load(date_year){
    // Source des quelques lignes du dessous : https://www.youtube.com/watch?v=m9OSBJaQTlM
    // const dt = new Date();

    // const day = dt.getDate();
    // const month = dt.getMonth();
    // const year = dt.getFullYear();

    // Registers the different days. It registers a total of 21 days : the current week, the last and next week.

    for ( i = 0 ; i <= 30 ; i++ ){
        
        if ( i <= 15 ){
            document.getElementById('date').innerHTML += 
            '<span class="day"> <p class="day_name before">' + week[(date.getDay() + i - 15 + 7 * 3) % 7] + '</p>' + 
            '<p class="day_number before">' + date.addDays(i - 15).getDate() + '</p> </span>';
            date_year.push(date.addDays(i - 15));
        } else {
            document.getElementById('date').innerHTML += 
            '<span class="day"> <p class="day_name after">' + week[(date.getDay() + i - 15 + 7 * 3) % 7] + '</p>' +
            '<p class="day_number after">' + date.addDays(i - 15).getDate() + '</p> </span>';
            date_year.push(date.addDays(i - 15));
        } 
    }
}

load(date_year);

// Allows to directely start at the middle of the slider once we load the page. 
document.querySelector('#date').scrollLeft = (document.querySelector('#date').scrollWidth) / 2 - document.querySelector('#date').offsetWidth / 2;

// Smooth scrolling with lock isn't implemented.
document.querySelector('#date').addEventListener('scroll', function(){
    // Detects the position and returns the value of the date we are currently on. 
    if ( document.querySelector('#date').scrollLeft % 45 <= 2 ) {

        const day_name = document.elementFromPoint(document.getElementById('select').getBoundingClientRect().left + 10, document.getElementById('select').getBoundingClientRect().top + 20);
        const day_number = document.elementFromPoint(document.getElementById('select').getBoundingClientRect().left + 10, document.getElementById('select').getBoundingClientRect().top + 40);

        for ( i = 0 ; i < date_year.length - 1 ; i++) {
            
            if ( day_number.innerHTML == date_year[i].getDate() ) {
                console.log( date_year[i] );
            }
        }
    }
})