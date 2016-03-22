'use strict';
angular.module('app.notify', [])
    .service('notify', Notify)

function Notify($timeout, $window, Notification) {
    var notify = {
        allowed: false,
        show: show,
        close: close,
        notification: {}
    };
    //   If we have access to the notification api
    if ($window.Notification) {
        // Request for user permission
        $window.Notification.requestPermission();
    }

    function show(message, icon, time, url, type) {
        if (!$window.Notification) {

            notify.allowed = false;
            return;
        };

        $window.Notification.requestPermission(function(result) {
            // If the user has granted permission
            if (result === 'granted') {
                // Use Native Notifications
                notify.notification = new $window.Notification('Karite', {
                    icon: icon,
                    body: message
                });

                if (url) {
                    notify.notification.onclick = function() {
                        if (url !== undefined) {
                            $window.open(url);
                            notify.notification.close();
                        }
                    }
                }

                $timeout(function() {
                    notify.notification.close();
                }, (time || 4000))
            } else {
                console.log('fallback to angular notifications')
                if (type === undefined) {
                    type = 'success';
                }

                console.log(type)

                if (type.toLowerCase() === 'error') {
                    Notification.error({'message': message, positionY: 'bottom', positionX: 'right'});
                } else if (type.toLowerCase() === 'success') {
                    Notification.success({'message': message, positionY: 'bottom', positionX: 'right'});
                }  else if (type.toLowerCase() === 'info') {
                    Notification.info({'message': message, positionY: 'bottom', positionX: 'right'});
                }  else if (type.toLowerCase() === 'warning') {
                    Notification.warning({'message': message, positionY: 'bottom', positionX: 'right'});
                }

            //    Display using angular Notifications
            }


        })
    }

    function close() {
        return notify.notification.close();
    }

    return notify;
};