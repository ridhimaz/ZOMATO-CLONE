function askRestrauntToAcceptOrReject() {
    //callback
    setTimeout(() => {
        isOrderAccepted = confirm('Should restaurant accept order?');
        hasRestaurantSeenYourOrder = true;
        // console.log(isOrderAccepted);
    }, 1000);

}
