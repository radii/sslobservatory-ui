function render_cert(src, fp) {
    var json = src + fp;
    $('#debug').append('json=' + json);
    $.getJSON(src + fp, function(data) {
	    $('#debug').append('func called');
            $('#content').append("<h2>Properties for<span id='keynum'> " + fp +
                "</span></h2><br>");
            $('#content').append("<table id='data'>");
            $(['RSA_Modulus_Bits', 'Serial Number', 'Issuer', 'ip',
                'fingerprint', 'Subject']).each(function() {
                    $('#content').append("<tr><td>" + this + "</td><td>" + data[this] + "</td></tr>");
            })
            $('#content').append("</table>");
	    $('tr:nth-child(2n+1)').addClass('even');
        })
}

