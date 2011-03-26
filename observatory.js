function render_cert(src, fp) {
    var json = src + fp;
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
    $('#debug').append('json=' + json);
    $.getJSON(src + fp, function(data) {
	    $('#debug').append('func called');
            $('#content').append("<h2>Properties for<span id='keynum'> " + fp +
                "</span></h2><br>");
            $('#content').append("<table id='data'>");
            $(fields).each(function() {
                    $('#content').append("<tr><td>" + this + "</td><td>" + data[this] + "</td></tr>");
            })
            $('#content').append("</table>");
	    $('tr:nth-child(2n+1)').addClass('even');
        })
}

