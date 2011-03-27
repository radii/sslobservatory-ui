function dbg(msg) {
    $('#debug').append(msg);
}

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
            $('#content').append("<h2>Properties for<span id='keynum'> " + data['fingerprint'] +
                "</span></h2><br>");
            function morsel(title, name, content) {
                $('#content').append('<li class="' + name + '"><span class="label">'
                    + title + ':</span> <span class="' + name + '">' + content + 
                    '</span></li>');
            }
            $('#content').append('<ul class=>');
            // stuff about the key
            morsel('IP', 'ip', data['ip']);

            // key details
            morsel('Key size', 'modulus_bits', data['RSA_Modulus_Bits']);
            morsel('Algorithm', 'algorithm', data['Signature Algorithm']);

            // x509 crap
            $('#content').append('<li>X.509 data <span class="moreclick" id="x509more">[more]</span><div id="x509opt"><ul>');
                morsel('X.509 Subject', 'subject', data['Subject']);
                morsel('Authority Key Identifier', 'akid', data['ext:X509v3 Authority Key Identifier:keyid']);
                morsel('Certificate Policies:Policy', 'cert_policies', data['ext:X509v3 Certificate Policies:Policy']);
                morsel('CRL Distribution Points', 'crl', data['ext:X509v3 CRL Distribution Points']);
            $('#content').append("</ul></div></li>");
        })
}

