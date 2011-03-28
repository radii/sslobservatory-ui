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
            function morsel(title, name, content) {
                return ('<li class="' + name + '"><span class="label">'
                    + title + ':</span> <span class="' + name + '">' + content + 
                    '</span></li>');
            }
	    var fetchtime = data['fetchtime'];
	    fetchtime = String(new Date(fetchtime * 1000)) + " (" + String(fetchtime) + ")";
            $('#content').append("<h2>Properties for <span id='keynum'>" + data['fingerprint'] +
                "</span></h2>" +
		"<span id='altlinks'>Other formats: <a href='" + json + "'>json</a> - " +
		"<a href='" + pem + "'>pem</a> - " +
		"<a href='" + der + "'>der</a>" +
		"<br><ul>" +
            // stuff about the use of the key
            morsel('IP', 'ip', data['ip']) +
	    morsel('Observed at', 'fetchtime', fetchtime) +

            // key details
	    '<li><span class="label">RSA key: </span> ' + data['RSA_Modulus_Bits'] + ' bits ' +
	    '<span class="moreclick" id="keymore">[more]</span><div class="defaulthidden" id="keyopt"><ul>' +
		morsel('Key size', 'modulus_bits', data['RSA_Modulus_Bits']) +
		morsel('Modulus', 'modulus', data['RSA Public Key:Modulus']) +
		morsel('Exponent', 'exponent', data['Subject Public Key Info:RSA Public Key:Exponent']) +
	    '</ul></div></li>' +

	    // signature
	    '<li><span class="label">Signature</span> <span class="moreclick" id="sigmore">[more]</span><div class="defaulthidden" id="sigopt"><ul>' +
		morsel('Signature', 'signature', data['Signature']) +
		morsel('Issuer', 'issuer', data['Issuer']) +
		morsel('Serial Number', 'serialnumber', data['Serial Number']) +
		morsel('Algorithm', 'algorithm', data['Signature Algorithm']) +
		morsel('Authority Key ID', 'akid', data['ext:X509v3 Authority Key Identifier:keyid']) +
		morsel('Valid From', 'startdate', data['startdate']) +
		morsel('Valid To', 'enddate', data['enddate']) +
	    '</ul></div></li>' +

            // x509 crap
            '<li><span class="label">X.509</span> <span class="moreclick" id="x509more">[more]</span><div class="defaulthidden" id="x509opt"><ul>' +
                morsel('X.509 Subject', 'subject', data['Subject']) +
                morsel('Authority Key Identifier', 'akid', data['ext:X509v3 Authority Key Identifier:keyid']) +
                morsel('Certificate Policies:Policy', 'cert_policies', data['ext:X509v3 Certificate Policies:Policy']) +
                morsel('CRL Distribution Points', 'crl', data['ext:X509v3 CRL Distribution Points']) +
                morsel('Key Usage', 'x509keyusage', data['ext:X509v3 Key Usage']) +
            '</ul></div></li>');
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
