$(function(){

    $('.fileSelect').click(function(){
        $("#file").click();
    })

    $('#file').change(function(){
        $('.filename').text($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

    $('button').click(function(e){
        if($('.filename').text() == 'No file chosen...'){
            e.preventDefault();
            $("#status").empty().text("No file selected");
        }
    });

    $('.data .types div').click(function(){
        $('.data .types div').removeClass('active')
        $('.data .csv, .data .table').removeClass('active')
        $('.'+$(this).attr('class').split(" ")[0]).addClass('active')
        $(this).addClass('active')
    })

    $('.form').submit(function() {
        $('.data .types div').removeClass('active')
        $("#status").empty().text("File is currently being processed...");
        $('.data .content').empty();
        $(this).ajaxSubmit({
            error: function(xhr) {
                console.error('Error: ' + xhr.status + '. Please ensure that a valid file was uploaded.');
                $("#status").empty().text("An error occurred...");
            },
            success: function(response) {
                $(".csv .content").append("<p>"+response.data+"</p></div>")
                $('.csv').addClass('active')
                var arr = response.data.split(/,(?! )/)
                var table = "";
                table += '<tr>';
                for(i in arr){
                    if(arr[i].indexOf('<br/>') != -1) table += '</tr><tr>';
                    if(arr[i].length != 0) table += '<td>'+arr[i].replace(/<br\/>/g, '').replace(/"/g, '')+'</td>';
                }
                table += '</tr>';
                $(".table .content").append("<br><table><tbody>"+table+"</tbody></table></div>");
                console.log(response.data.replace(/<br\/>/g,''));
                $('#status').hide();
                $('.data').fadeIn();
                var blob = new Blob([response.data.replace(/<br\/>/g,'')], {type: "text/csv"});
                saveAs(blob, response.name+".csv");
            }
        });
        return false;
    });
})
