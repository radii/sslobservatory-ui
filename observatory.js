function dbg(msg) {
    $('#debug').append(msg + '\n');
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
                if (key in data)
                    $(this).html(data[key]);
            })
            function clickmore(elem, id) {
                $(id).toggle('fast');
                if (elem.html() == "hide") {
                    elem.html("show");
                } else {
                    elem.html("hide");
                }
            }
            $('.time_t').each(function(i, m) {
                var t = $(this).html();
                if (t.match(/^[0-9]+$/)) {
                    $(this).html(new Date(t * 1000) + " (" + t + ")");
                }
            })
            $('#x509more').click(function() {
                clickmore($(this), '#x509opt');
            })
            $('#sigmore').click(function() {
                clickmore($(this), '#sigopt');
            })
            $('#keymore').click(function() {
                clickmore($(this), '#keyopt');
            })
            $('#jsonlink').attr('href', json);

            var fingerprint = /SHA1 Fingerprint=(.*)/.exec(data.fingerprint);
            fingerprint = fingerprint[1].replace(/:/g, '').toLowerCase();
            dns.queryGoogleCertificateCatalog(fingerprint, display_google_certificate_catalog_status);
            dns.queryReverse(data.ip, display_ip_reverse_dns);
        })
}

function submit_searchbox() {
    dbg("submit_searchbox called");
    var x = $('#shasearch').serializeArray();
    dbg('x = ' + x);
    $(x).each(function(i, m) {
        var e = m.value.toLowerCase().replace(/:/g,"");
        e = e.replace(/ *$/, "");
        e = e.replace(/^ */, "");
        dbg('i = ' + i + ' e = ' + e);
        if (!e.match(/^[0-9a-f]{40}$/)) {
            alert('invalid SHA1 "' + e + '".');
            return;
        }
        window.location.search = "?sha1=" + e;
    })
}

function display_ip_reverse_dns(infos) {
    var content = "No reverse DNS information found";
    
    if (infos !== undefined) {
        content = 'Reverse DNS : <strong>' + infos + '</strong>';
    }
    
    var element = $('span.ip').filter('.data');
    element.addClass('withReverseDnsInfos');
    element.tipTip({ defaultPosition: 'top', maxWidth: 'auto', content: content });
}

function display_google_certificate_catalog_status(status) {
    var span = $('#googleCatalog');
    span.toggleClass('known', status !== undefined);
    span.toggleClass('unknown', status === undefined);
    
    if (status === undefined) {
        span.text('Certificate unknown to Google');
        span.tipTip({ defaultPosition: 'right', maxWidth: 'auto', content: 'Google never saw this certificate.' });
    } else {
        span.text('Google know this certificate');
        
        var content = 'Google saw this certificate <strong>' + status.timesSeen + '</strong> times.';
        content += '<ul><li>The first time was on <strong>' + status.firstSeen + '</strong></li>';
        content += '<li>The last time was on <strong>' + status.lastSeen + '</strong></li></ul>';
        span.tipTip({ defaultPosition: 'top', maxWidth: 'auto', content: content });
    }
}
