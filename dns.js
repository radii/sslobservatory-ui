dns = {};
(function(undefined) {
    
    // Having a standard json call here will be a lot more secure.
    var baseUrl = 'http://dig.jsondns.org/IN/';
    var dataType = 'jsonp';

    dns.query = function(nameToResolve, field, callback) {
        if (callback === undefined) {
            callback = field;
            field = 'A';
        }
        
        var url = baseUrl + nameToResolve + '/' + field;
        
        jQuery.ajax({ url: url, dataType: dataType, success: callback });
    };
    
    dns.queryReverse = function(ip, callback) {
        var ipv4 = ip.match(/([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/);

        if (ipv4 === null) return;
        
        ipv4.shift();
        ipv4.reverse();
        var nameToResolve = ipv4.join('.') + '.in-addr.arpa';
        
        dns.query(nameToResolve, 'PTR', function(data) {
            if (data === undefined || data.answer === undefined || data.answer.rdata === undefined) {
                callback(undefined);
            } else {
                callback(data.answer.rdata);
            }
        });
    };
    
    var parseGoogleCatalogAnswer = function(answer) {
        var arr = answer.split(' ');
        if (arr.length != 3) return answer;
        
        return {
            firstSeen: new Date(arr[0] * 1000*60*60*24),
            lastSeen: new Date(arr[1] * 1000*60*60*24),
            timesSeen: Number(arr[2])
        };
    };
    
    /* Query the google certificate catalog to know when google saw this certificate
     */
    dns.queryGoogleCertificateCatalog = function(sha1, callback) {
        var nameToResolve = sha1 + '.certs.googlednstest.com';
        
        dns.query(nameToResolve, 'TXT', function(data) {
            if (data === undefined || data.answer === undefined || data.answer.length == 0
                || data.answer[0] === undefined || data.answer[0].rdata === undefined
                || data.answer[0].rdata.length == 0) {
                callback(undefined);
            } else {
                callback(parseGoogleCatalogAnswer(data.answer[0].rdata[0]));
            }
        });
    };
})();