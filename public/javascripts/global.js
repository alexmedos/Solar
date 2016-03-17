// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(createGraph);
    createGraph();
    refresh();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    var arr = [];
    var arrPos = 0;
    var tableLimit = 10;

    // jQuery AJAX call for JSON
    $.getJSON( '/api/', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            arr[arrPos++] = this;
        });

        arrPos--;

        while( tableLimit-- ) {
            if( arr[arrPos] !== undefined ) {
                tableContent += '<tr>';
                tableContent += '<td>' + arr[arrPos].voltage + '</td>';
                tableContent += '<td>' + arr[arrPos].current + '</td>';
                tableContent += '<td>' + arr[arrPos].power.toFixed(2) + '</td>';
                tableContent += '<td>' + arr[arrPos--].time + '</td>';
                tableContent += '</tr>';
            }
        }

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);


    });
};

function createGraph() {

        var arr = [];
        var arrPos = 0;
        var graphLimit = 16;
        var graphPos = 0;

        $.getJSON( '/api/', function( data ) {

            $.each(data, function(){
                arr[arrPos++] = this;
            });


            --arrPos;

            var data = new google.visualization.DataTable();
            data.addColumn('number', '');
            data.addColumn('number', 'POWER');

            while( graphLimit-- ) {
                if( arr[arrPos-graphLimit] !== undefined ) {
                    data.addRows([
                        [4*graphPos++, arr[arrPos-graphLimit].power]
                    ]);
                }
            }

            var options = {
                chart: {
                    title: 'Power Generated in last minute',
                    subtitle: 'in Watts'
                },
                width: 900,
                height: 300,

                vAxis: {
                    viewWindow: {
                        min: 0,
                        max: 10
                    },
                    ticks: [0, 2, 4, 6, 8, 10]
                }
            };

            var chart = new google.charts.Line(document.getElementById('chart'));

            chart.draw(data, options);

        });
};

function refresh()  {

    populateTable();
    createGraph();
    setTimeout(refresh, 4000);
}