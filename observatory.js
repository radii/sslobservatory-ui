function dbg(msg) {
    $('#debug').append(msg);
}

function render_cert(src, fp) {
    var json = src + fp;
    var pem = json + "/pem";
    var der = json + "/der";
    var fields = ['Subject', 'RSA_Modulus_Bits', 'fingerprint',
                  'Issuer', 'Serial Number',
                  'ext:X509v3 Key Usage', 'ext:X509v3 Extended Key Usage',
                  'ip', 'fetchtime',
                  'Signature Algorithm', 'Signature',
                  'Subject Public Key Info:Public Key Algorithm',
                  'RSA Public Key:Modulus', 'Subject Public Key Info:RSA Public Key:Exponent',
                  'Validity:Not Before', 'Validity:Not After',
                  'ext:X509v3 Authority Key Identifier:keyid',
                  'ext:X509v3 Certificate Policies:Policy',
                  'ext:X509v3 CRL Distribution Points',
                 ]
    dbg('json=' + json);
    $.getJSON(src + fp, function(data) {
            $('.data').each(function(i, m) {
                var key = $(this).attr('datasrc');
                console.log("#data each i=" + i + " key=" + key);
                $(this).html(data[key]);
            })
            $('#x509more').click(function() {
                    $('#x509opt').toggle('fast');
                    $(self).html("[hide]");
                    })
            $('#sigmore').click(function() {
                    $('#sigopt').toggle('fast');
                    $(self).html("[hide]");
                    })
            $('#keymore').click(function() {
                    $('#keyopt').toggle('fast');
                    $(self).html("[hide]");
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
