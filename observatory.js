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
    dbg('json=' + json);
    $.getJSON(src + fp, function(data) {
            function morsel(title, name, content) {
                return ('<li class="' + name + '"><span class="label">'
                    + title + ':</span> <span class="' + name + '">' + content + 
                    '</span></li>');
            }
            $('#content').append("<h2>Properties for<span id='keynum'> " + data['fingerprint'] +
                "</span></h2><br><ul>" +
            // stuff about the use of the key
            morsel('IP', 'ip', data['ip']) +

            // key details
            morsel('Key size', 'modulus_bits', data['RSA_Modulus_Bits']) +
            morsel('Algorithm', 'algorithm', data['Signature Algorithm']) +
            morsel('RSA modulus', 'modulus', data['RSA Public Key:Modulus']) +

            // x509 crap
            '<li><span class="label">X.509</span> <span class="moreclick" id="x509more">[more]</span><div class="defaulthidden" id="x509opt"><ul>' +
                morsel('X.509 Subject', 'subject', data['Subject']) +
                morsel('Authority Key Identifier', 'akid', data['ext:X509v3 Authority Key Identifier:keyid']) +
                morsel('Certificate Policies:Policy', 'cert_policies', data['ext:X509v3 Certificate Policies:Policy']) +
                morsel('CRL Distribution Points', 'crl', data['ext:X509v3 CRL Distribution Points']) +
            '</ul></div></li>');
            $('#x509more').click(function() {
                    $('#x509opt').toggle('fast');
                    $(self).html("[hide]");
                    })
        })
}

