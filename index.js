let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false;

window.addEventListener('load',function(){
    document.getElementById('acceptOrder').addEventListener('click',function(){
        askRestaurantToAcceptOrReject();
    });

    document.getElementById('findValet').addEventListener('click',function(){
        startSearchingForValets();
    })

    this.document.getElementById('deliverOrder').addEventListener('click',function(){
        setTimeout(() => {
            isOrderDelivered = true;
        }, 2000); 
    })

    checkIfOrderAcceptedFromRestaurant()
        .then(isOrderAccepted=>{
            console.log('updated from restaurant - ',isOrderAccepted);

            // Step - Start preparing
            if (isOrderAccepted) startPreparingOrder();
            // Step 3 - Order rejected
            else alert('Sorry restaurant couldnt accept your order! Returing your amount with zomato shares');
        })
        .catch(err=>{
            console.error(err);
            alert('Something went wrong! Please try again later');
        })
})



function askRestaurantToAcceptOrReject(){
    // callback
    setTimeout(() => {
        isOrderAccepted = confirm('Should restaurant accept order?');
        hasRestaurantSeenYourOrder = true;
    }, 1000);
    
} 


function checkIfOrderAcceptedFromRestaurant() {
    console.log("enter check");
    return new Promise((resolve) => {
        restaurantTimer = setInterval(() => {
            console.log('checking if your order is handled');
           if (!hasRestaurantSeenYourOrder) return;
           console.log('after return...')
            if (isOrderAccepted) {
                resolve(true);
            }
            else {
                resolve(false)
            }
            clearInterval(restaurantTimer);
        }, 2000)
    });
   //console.log("handsome")
}



function startPreparingOrder() {
    Promise.all([
        updateOrderStatus(),
        updateMapView(),
        checkIfValetAssigned(),
        startSearchingForValets(),
        checkIfOrderDelievered()
    ]).then(res => {
        console.log(res);
        setTimeout(() => {
            alert('Rate your order');
        }, 2000);
    })
        .catch(err => {
            console.log(err);
        })
}

function updateOrderStatus(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            document.getElementById('currentStatus').innerText = isOrderDelivered ? 'Order Delivered successfully' : 'Preparing your order';
            resolve('status updated');
        },1500);
    })
}

function updateMapView(){
    // Fake delay to get data
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            document.getElementById('mapview').style.opacity = '1';
            resolve('map initialised');
        }, 1000);
    });
}


function startSearchingForValets(){
    // BED
    // Bht complex operations:-
    /**
     * 1. Get all locations of nearby valets
     * 2. Sort the valets based on shortes path of restaurant 
     * + to customer home
     * 3. Select the valet with shortest distance and minimum orders
     */

    // Step 1 - get valets
    const valetsPromises = [];
    for (let i = 0;i<5;i++) {
        valetsPromises.push(getRandomDriver());
    }
    console.log(valetsPromises);

    Promise.any(valetsPromises)
    .then(selectedValet =>{
        console.log('Selected a valet => ',selectedValet);
        isValetFound = true;
    })
    .catch(err=>{
        console.error(err);
    })
}

function getRandomDriver(){
    // Fake delay to get location data from riders
    return new Promise((resolve,reject)=>{
        const timeout = Math.random()*1000;
        setTimeout(() => {
            resolve('Valet - '+timeout);
        }, timeout);
    });
}

function checkIfValetAssigned(){
    return new Promise((resolve, reject)=>{
        valetTimer = setInterval(() => {
            console.log(' searching for valet');
            if (isValetFound) {
                updateValetDetails();
                resolve('updated valet details');
                clearTimeout(valetTimer);
            }
        }, 1000);
    })
}

function checkIfOrderDelievered(){
    return new Promise((resolve, reject)=>{
        valetDeliveryTimer = setInterval(() => {
            console.log('is order delivered by valet');
            if (isOrderDelivered) {
                resolve('order delivered valet details');
                updateOrderStatus();
                clearTimeout(valetDeliveryTimer);
            }
        }, 1000);
    })
}

function updateValetDetails(){
    if (isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }
}



// Promise - then,catch.   Callback - resolve, reject
// Types of promise - 
// 1. Promise.all - saare operations call paralley, if one fails, promise.all fails
// 2. Promise.allsettled - saare operations call paralley, if one fails - dont give a damn, promise.allsettles passes
// 3. Promise.race - first promise to complete - whether it is resolved or rejected
// 4. Promise.any - first promise to fullfil that is resolved/fullfilled