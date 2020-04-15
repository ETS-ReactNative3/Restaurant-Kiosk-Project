import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'


//function will add a order to the database
//the function will return the orderID
//the functions parameter is a string which is the customerID
//for example createOrder("l8qDPeaGzOC4egZMW5hW", "3")
export async function createOrder(custID, tableNum) {
    
    
    let autoID = firebase.firestore().collection('Orders').doc().id;
    
    let potentialError;

    await firebase.firestore().collection('Orders').doc(autoID).set({
        customerID: custID,
        order: null,
        waitstaff: null,
        tableNumber: tableNum,
        completionStatus: false,
        price: null,
        requests: null,
        orderId: autoID 
    })
    .then(() => {
        console.log("Successfully created order.");
        isSuccess = true;
    })
    .catch((error) => {
        console.log("Error creating Order: ", error);
        potentialError = error;
        isSuccess = false;
    });
    
    if (!isSuccess) {
        return potentialError;
    }

    return autoID;
}


//this function will add an item to the order
//the parameter orderID is a string, and item is  a array of items
//for example: 
//let item=['Pizza', 'Cheese Cake'],
//addItemToOrder('v6J7iJmyHxW5CIdCosvK', item)
export async function addItemToOrder(orderID, item) {
    let isSuccess;

    await firebase.firestore().collection('Orders').doc(orderID).update({ item })
    .then((success) => {
        isSuccess = true;
    })
    .catch((error) => {
        console.log('Error adding to order: ', error);
        isSucces = false;
    });

    return isSuccess;
}

//this function will remove an order from the data base
//orderId is a string which is the order ID
//for example: removeOrder('v6J7iJmyHxW5CIdCosvK')
export async function removeOrder(orderId) {
    let isSuccess;

    await firebase.firestore().collection('Orders').doc(orderID).delete()
    .then(() => {
        isSuccess = 1;
    })
    .catch((error) => {
        console.log('Error deleting order: ', error);
        isSuccess = 0;
    });

    return isSuccess;
}


//this function gets all the orders in the database
export async function getOrders() {
    let query;

    await firebase.firestore().collection('Orders').get()
    .then((snapshot) => {
        query = snapshot.docs.map(doc => doc.data());
    })
    .catch ((error) => {
        console.log('Error getting document', error);
        query = null;
    });
    
    return query;
}


//this function updates a specific order in the database
//the function takes a object as it's parameter
//for example:
//let item = {
//     completionStatus: false,
//     customerID: "l8qDPeaGzOC4egZMW5hW",
//     orderID: "v6J7iJmyHxW5CIdCosvK",
//     orderedItems: ["Pizza" ,"Apple Pie"],
//     price: 8.99,
//     requests: "none",
//     tableNumber: "3",
//     waitstaff: "4MfW9403U5WqT5cSIgbG"
// }
//the completionStatus will remain false
//the customerID will remain the same
//the orderID will remain the same
//the orderedItems will change to Pizza and Cheese Cake
//the price will change to 20.99
//the requests will change to make the pizza well done
//the table number will remain the same
//the waitstaff will remain the same
//for example: updateOrderInformation(item)
export async function updateOrderInformation(item) {
    let isSuccess;

    await firebase.firestore().collection('Orders').doc(item.orderID).update(item)
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error updating Order in database table: ", error);
        isSuccess = false;
    });

    return isSuccess;
}


//this function will get table orders
//the parameter is a string which is the table number
//for example getTableOrders('3')
export async function getTableOrders(tableNumber){

    let orders = []

    await firebase.firestore().collection('Inventory').where('tableNumber', '==', tableNumber).get()
    .then((snapshot) => {
        orders = snapshot.docs.map(doc => doc.data());
        console.log('Successfully retreived orders.')
    })
    .catch ((error) => {
        alert('Unable to retrieve order information', error);
    });

    if (orders = []) {
        return 'No orders for this table';
    }

    return orders;
}

export async function confirmOrder(ordID, custID, tableNum, items){

   
    
//     for (i in items) {
//         if (items[i].quantity > 0) {
//             order.push(items[i]);
//         }
//     }
    
    let newArray = []; 
    let uniqueObject = {}; 
    
    for (i in items) { 
        let objTitle = items[i]['name'];  
        uniqueObject[objTitle] = items[i]; 
    } 
    
    for (i in uniqueObject) { 
        newArray.push(uniqueObject[i]); 
    } 
    
    let order = newArray;    
    let inventory;

    await firebase.firestore().collection('Inventory').get()
    .then((snapshot) => {
        inventory = snapshot.docs.map(doc => doc.data());
    })
    .catch ((error) => {
        console.log('Error getting document', error);
        inventory = null;
    });
    
    if (inventory == null) {
        return false;
    }
    
    
    let hasEnoughInventory = true;
    
    for (i in order) {
        for (j in order[i].ingredients) {
            for (k in inventory) {
                if (inventory[k].ingredientName == order[i].ingredients[j] && inventory[k].ingredientQuantity == 0) {
                    hasEnoughInventory = false;
                    break;
                }
            }
        }
    }
     
    if (!hasEnoughInventory) {
        return false;
    }
    
    let finalizedOrder = [];
    let totalPrice = 0;
    
    for (i in order) {
        finalizedOrder.push(order[i].name.concat(" ", order[i].quantity.toString()));
        totalPrice += (order[i].quantity * order[i].price);
    }
    
    let staffID;
    let isSuccess;
    
    await firebase.firestore().collection('Tables').where('tableNumber', '==', tableNum).get()
    .then((snapshot) => {
        console.log('Successfully retrieved waitstaff id.');
        staffID = snapshot.docs.map(doc => doc.data());
        isSuccess = true;
    })
    .catch((error) => {
      alert("Error getting waitstaff id from table: ", error);
      isSuccess = false;
     
    });
    
    if (!isSuccess) {
        return false;
    }
    
    staffID = staffID[0];
    
    let completeOrder = {
        completionStatus: false,
        customerID: custID,
        waitstaff: staffID,
        orderID: ordID,
        orderedItems: finalizedOrder,
        price: totalPrice,
        requests: 'none',
        tableNumber: tableNum
    };
    
    await firebase.firestore().collection('Orders').doc(completeOrder.orderID).update(completeOrder)
    .then((success) => {
        isSuccess = true;
    })
    .catch((error) => {
        console.log('Error adding to order: ', error);
        isSucces = false;
    });
    
    return isSuccess;
    
}
