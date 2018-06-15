/**
 * 
 * Retrieves the Data from Traffic Cameras
 * 
 * 
 */

var map = null;

async function getAnalytics() {

    $('#waitDialog').css('display', 'inline-block');

    try {
        let promise = new Promise((resolve) => {
            
            getGoogleAnalytics();

        });

        await promise;

    } catch(e) {
        alert(e);
    }

}

function getGoogleAnalytics() {

    var parameters = {format:'JSON'};

    $.get('/retrieve', parameters, function(data) {  
        var result = JSON.parse(data);

        var html = '<table>';

        var result = JSON.parse(data);
    
        html += '<tr><td style="width:200px;">Sessions</td><td style="width:200px;">PageViews</td><td style="width:200px;">Users</td></tr>';

        for (var row = 0; row < result.length; row++) {

            html += '<td>' + result[row].reports[0].data.rows[0].metrics[0].values[0] +'</td>';
            html += '<td>' + result[row].reports[0].data.rows[0].metrics[0].values[1] +'</td>';
            html += '<td>' + result[row].reports[0].data.rows[0].metrics[0].values[2] +'</td>';

            html += '</tr>';

        }

        html += '</table>';
     

        $('#mainbox').html(html);
        $('.status').html('<p>Processed - ' + Date().toString() + '</p>');
        $('#waitDialog').css('display', 'none');

    });  

}

$(document).ready(function() {
});

$('#retrieve').on('click', function(e) {

    getAnalytics();

    return false;

});
