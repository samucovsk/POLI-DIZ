const displayNotify = function (toastTitle, toastText, statusType, duration = 8000) {
    return new Notify({
        status: statusType,
        title: toastTitle,
        text: toastText,
        effect: 'fade',
        speed: 500,
        showIcon: true,
        showCloseButton: true,
        autoClose: true,
        autoTimeout: duration,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'bottom-right' 
    });
}