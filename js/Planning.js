// ________________ Initialization ________________
var nav = 0;
var date = new Date();
const week = ["D", "L", "M", "Me", "J", "V", "S"];
var date_year = [];

// Source : https://stackoverflow.com/questions/7708819/keep-only-first-n-characters-in-a-string
Date.prototype.addDays = function(days) {
    // Alows to add or substract days in the UI. 
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function return_day( date ) {
    // This function allows to return the day under this format : "jj mm yyyy"

    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();

    return day.concat(' ', month).concat(' ', year);

}

function hour_converter( hour ) {
    // Converts the hours + minutes into decimals. Ex : 3 30 => 3.5

    hour = hour + '';
    const hour_splited = hour.split(' ');
    const answer = parseInt(hour_splited[0]) + (parseInt(hour_splited[1]) * 100 / 6000);

    return answer;
}

function hourToHeight(begin, end) {
    // Converts a decimal hour into the position Y and height taken on the page.

    const time = hour_converter(end) - hour_converter(begin);
    const height = time * 334 / 9;
    const posY = 28 + (hour_converter(begin) - 9) * 334 / 9 ;

    return [Math.floor(posY) - 1, Math.floor(height) + 1]
}

function load(date_year){
    // This function is used to setup the day scroller. This scroller will be used for many different purposes, such as to retrieve the day we are currently in while we scroll. 

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

function search_date ( date_searched ) {
    // Searches the date in the array date_year.
    for ( i = 0 ; i < date_year.length - 1 ; i++ ) {  
        if ( date_searched == date_year[i].getDate() ) {
            nav = return_day(date_year[i]);
            API_request(nav);
            break;
        }
    }
}

// function hour_string( hour_start, hour_end){
//     // Converts the hour + date into a string which can be read on the schedule. It doesn't seem to work, so this function will be taken out.

//     const hour = [hour_start, hour_end]
//     let b_hour = ''

//     for ( i = 0 ; i < hour.length ; i++ ){
//         let a_hour = hour[i].split(' ');
//         a_hour[0] = a_hour[0].concat('', 'h');
//         a_hour[1] = a_hour[1].concat('', 'min');

//         if ( i === 1) {
//             b_hour = b_hour.concat('', ' - ')
//         }

//         b_hour = b_hour.concat('', a_hour[0].concat(' ', a_hour[1]));
//     }

//     return b_hour
// }



// ________________ Day scroller ________________

load(date_year);

// Allows to directely start at the middle of the slider once we load the page. 
document.querySelector('#date').scrollLeft = (document.querySelector('#date').scrollWidth) / 2 - document.querySelector('#date').offsetWidth / 2;

search_date(date.getDate());

// Smooth scrolling with lock isn't implemented.
document.querySelector('#date').addEventListener('scroll', function(){
    // Detects the position and returns the value of the date we are currently on. 
    if ( document.querySelector('#date').scrollLeft % 45 <= 4 ) {

        // const day_name = document.elementFromPoint(document.getElementById('select').getBoundingClientRect().left + 10, document.getElementById('select').getBoundingClientRect().top + 20);
        const day_number = document.elementFromPoint(document.getElementById('select').getBoundingClientRect().left + 10, document.getElementById('select').getBoundingClientRect().top + 40);

        search_date(day_number.innerHTML);
    }
})



// ________________ The day's schedule ________________

function API_request(time){
    // Display the informations concerning the day we decide to put as parameter. The code below was inspired by this link : https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5577591-recuperez-des-donnees-dun-service-web

    fetch("../json/Calendrier.json").then(function(r){
        // Reads the json file which contains information about the day
        if (r.ok){
            return r.json();
        }
    }).then(function(value){
        // Retrieve the information of the specitic days and returns the events from that day in an array.

        let new_day_events = [];

        for ( i = 0 ; i < value.length ; i++ ) {
            if ( time == value[i].Date){
                new_day_events.push(value[i]);
            }
        }
        return new_day_events
        
    }).then( function(e) {
        // Uses the information to change the html and display the schedule. 

        document.getElementById('day_events').innerHTML = [];
        let color;

        for ( i = 0 ; i < e.length ; i++ ) {

            pos_height = hourToHeight( e[i].Debut, e[i].Fin );

            if ( e[i].Type == "Formation" ){
                // Green
                color = "4BA37A";
            } else if ( e[i].Type == "Rendez-vous" ){
                // Orange
                color = "FA754C";
            } else if ( e[i].Type == "Atelier" ){
                // Yellow
                color = "27527C";
            } else {
                // Blue
                color = "FDD35D";
            }

            if ( e[i].Lien === "" ){
                document.getElementById('day_events').innerHTML +=
                '<span style="height:' + pos_height[1] + 'px; top:' + pos_height[0] +'px; "> <div style="height:' + pos_height[1] + 'px; background-color: #' + color + ';"></div> <p style="color: #' + color + '; height:' + (pos_height[1] - 10) + 'px;"> <strong>' + e[i].Type + ' : </strong> ' + e[i].Nom + ' <br><strong>Date : </strong> ' + e[i].Date_Tot + '<br> <Strong>Responsable : </strong>' + e[i].Formateur + ' <br><strong>Salle : </strong> ' + e[i].Salle + '</p> </span>' ;
            } else {
                document.getElementById('day_events').innerHTML +=
                '<span style="height:' + pos_height[1] + 'px; top:' + pos_height[0] +'px; "> <div style="height:' + pos_height[1] + 'px; background-color: #' + color + ';"></div> <p style="color: #' + color + '; height:' + (pos_height[1] - 10) + 'px;"> <strong>' + e[i].Type + ' : </strong> ' + e[i].Nom + ' <br><strong>Date : </strong> ' + e[i].Date_Tot + '<br> <Strong>Responsable : </strong>' + e[i].Formateur + ' <br><strong>Salle : </strong> ' + e[i].Salle + '<br><strong>Lien : </strong> <a href="'+ e[i].Lien + ' target="_blank" style="color: #' + color + ';"> Cliquez-ici</a> </p> </span>' ;
            }

        }

    }).catch(function(error){
        console.log(error);
    })
}
