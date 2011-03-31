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
                console.log("#data each i=" + i + " key=" + key);
                $(this).html(data[key]);
            })
            $('#x509more').click(function() {
                    $('#x509opt').toggle('fast');
                    if ($(this).html() == "[hide]") {
			$(this).html("[show]");
		    } else {
			$(this).html("[hide]");
                    }
	    })
            $('#sigmore').click(function() {
                    $('#sigopt').toggle('fast');
                    if ($(this).html() == "[hide]") {
			$(this).html("[show]");
		    } else {
			$(this).html("[hide]");
                    }
                    })
            $('#keymore').click(function() {
                    $('#keyopt').toggle('fast');
                    if ($(this).html() == "[hide]") {
			$(this).html("[show]");
		    } else {
			$(this).html("[hide]");
                    }
                    })
        })
}

function submit_searchbox() {
    console.log("submit_searchbox called");
    var x = $('#shasearch').serializeArray();
    console.log('x = ' + x);
    $(x).each(function(i, m) {
        var e = m.value.toLowerCase().replace(/:/g,"");
        console.log('i = ' + i + ' e = ' + e);
        if (!e.match(/^[0-9a-f]{40}$/)) {
            alert('invalid SHA1 "' + e + '".');
            return;
        }
        window.location.search = "?sha1=" + e;
    })
}
