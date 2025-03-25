function showAlert(type, topic, message) {
    const toastrOptions = {
        closeButton: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventDuplicates: true,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    toastr.options = toastrOptions;

    console.log(`[NOTIFY ${type}] ${topic}: ${message}`);

    if (type === 'success') {
        toastr.success(topic, message);
    } else if (type === 'error') {
        toastr.error(topic, message);
    } else if (type === 'info') {
        toastr.info(topic, message);
    } else if (type === 'warning') {
        toastr.warning(topic, message);
    } else {
        toastr.info(topic, message);
    }
}