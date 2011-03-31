function dbg(msg) {
    $('#debug').append(msg);
}

function render_cert(src, fp) {
    var json = src + fp;
    var pem = json + "/pem";
    var der = json + "/der";
    dbg('json=' + json);
    $.getJSON(json, function(data) {
            $('.data').each(function(i, m) {
                var key = $(this).attr('datasrc');
                dbg("#data each i=" + i + " key=" + key);
                $(this).html(data[key]);
            })
	    function clickmore(id) {
		$(id).toggle('fast');
		if ($(this).html() == "[hide]") {
		    $(this).html("[show]");
		} else {
		    $(this).html("[hide]");
		}
	    }
            $('#x509more').click(function() {
		clickmore('#x509opt');
	    })
            $('#sigmore').click(function() {
		clickmore('#sigopt');
	    })
            $('#keymore').click(function() {
		clickmore('#keyopt');
	    })
        })
}

function submit_searchbox() {
    dbg("submit_searchbox called");
    var x = $('#shasearch').serializeArray();
    dbg('x = ' + x);
    $(x).each(function(i, m) {
        var e = m.value.toLowerCase().replace(/:/g,"");
        dbg('i = ' + i + ' e = ' + e);
        if (!e.match(/^[0-9a-f]{40}$/)) {
            alert('invalid SHA1 "' + e + '".');
            return;
        }
        window.location.search = "?sha1=" + e;
    })
}
