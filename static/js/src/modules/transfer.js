window.easemobim = window.easemobim || {};
window.easemobIM = window.easemobIM || {};

easemobIM.Transfer = easemobim.Transfer = (function () {
	'use strict'
   
    var handleMsg = function ( e, callback, accept ) {
        if ( JSON && JSON.parse ) {
            var msg = e.data;
            msg = JSON.parse(msg);

            if ( accept && accept.length ) {
                for ( var i = 0, l = accept.length; i < l; i++ ) {
                    if ( msg.key === accept[i] ) {
                        typeof callback === 'function' && callback(msg);
                    }
                }
            } else {
                typeof callback === 'function' && callback(msg);
            }
        }
    };

    var Message = function ( iframeId, key ) {
        if ( !(this instanceof Message) ) {
             return new Message(iframeId);
        }
        this.key = key;
        this.iframe = document.getElementById(iframeId);
        this.origin = location.protocol + '//' + location.host;
    };

    Message.prototype.send = function ( msg, to ) {

        msg.origin = this.origin;

        msg.key = this.key;

        if ( to ) {
            msg.to = to;
        }

        msg = JSON.stringify(msg);

        if ( this.iframe ) {
            this.iframe.contentWindow.postMessage(msg, '*');
        } else {
            window.parent.postMessage(msg, '*');
        }
        return this;
    };

    Message.prototype.listen = function ( callback, accept ) {
		var me = this;

        if ( window.addEventListener ) {
            window.addEventListener('message', function ( e ) {
                handleMsg.call(me, e, callback, accept);
            }, false);
        } else if ( window.attachEvent ) {
            window.attachEvent('onmessage', function ( e ) {
                handleMsg.call(me, e, callback, accept);
            });
        }
        return this;
    };

    return Message;
}());