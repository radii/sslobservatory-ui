dns = {};
(function($, undefined) {

    // Having a standard json call here will be a lot more secure.
    // But except if the jsondns source code is available locally it's not really possible as cross-domain requests
    // aren't really supported everywhere (And IE is annoying as usual see http://goo.gl/fz3uL).     
    var dataType = 'jsonp';
    
    // jsondns is a an open source ruby script (Apache 2.0 license) : https://github.com/jpf/jsondns
    var baseUrl = 'http://dig.jsondns.org/IN/';

    dns.query = function(nameToResolve, field, callback) {
        if (callback === undefined) {
            callback = field;
            field = 'A';
        }
        
        var url = baseUrl + nameToResolve + '/' + field;
        
        $.ajax({ url: url, dataType: dataType, success: callback });
    };
    
    /* Query the dommain name associated with a given IP address.
     *
     * The argument to the callback is either undefined if nothing was found
     * or a string containing the domain name.
     */
    dns.queryReverse = function(ip, callback) {
        var ipv4 = ip.match(/([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/);

        var nameToResolve;
        if (ipv4 != null) {
            ipv4.shift();
            ipv4.reverse();
            nameToResolve = ipv4.join('.') + '.in-addr.arpa';
        } else {
            // FIXME : Parse as an ipv6 if possible and then use the
            //         [xxx].ipv6.arpa name instead of [xxx].in-addr.arpa
            
            callback(undefined);
            return;    
        }
        
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

        var conversion = 1000*60*60*24; // Days since unix epoch -> milliseconds since unix epoch
        
        return {
            firstSeen: new Date(arr[0] * conversion), 
            lastSeen: new Date(arr[1] * conversion),
            timesSeen: Number(arr[2])
        };
    };

    /* Query the google certificate catalog to know when google saw this certificate.
     *
     * The argument to the callback is either undefined if the sha1 hash isn't known to google or
     * an object with 3 properties :
     *  - firstSeen : The date of the first sighting of this certificate.
     *  - lastSeend : The date of the most recent  sighting of this certificate.
     *  - timesSeen : The number of times this certificate was seen between theses dates.
     *
     * The feature and format of the answer are specified in a blog post available at :
     * http://googleonlinesecurity.blogspot.com/2011/04/improving-ssl-certificate-security.html
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
})(jQuery);
