import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

//function to add a table to the database
//parameter is a item object.
//for example:
/*let item = {
    available: false,
    tableNumber: '1',
    waitstaff: 'Dak Prescott',
    }*/
//then pass item to the function i.e, addTables(item)
export async function addTables(item) {
    let isSuccess;

    await firebase.firestore().collection('Tables').add(item)
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error adding Table to database table: ", error);
        isSuccess = false;
    });

    return isSuccess;
}

//function to delete a table from the database
//parameter is a string which is the table number i.e., deleteTables('1') will delete the table who's number is 1
export async function deleteTables(tableNumber) {
    
    let isSuccess;

    await firebase.firestore().collection('Tables').doc(tableNumber).delete()
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error deleting Table from Table database table: ", error);
        isSuccess = false;
    });

    return isSuccess;
}

//function to get table information from the database
//parameter is a string which is the table number i.e., getTables('1') will get the table data for the table who's number is 1
export async function getTable(tableNumber) {
    let query;

    await firebase.firestore().collection('Tables').where('tableNumber', '==', tableNumber).get()
    .then((snapshot) => {
        query = snapshot.docs.map(doc => doc.data());
    })
    .catch ((error) => {
        console.log('Error getting document', error);
        query = null;
    });
    
    return query;
}


//function to update table information to the database
//parameter is a item object.
//for example:
/*let item = {
    available: false,
    tableNumber: '1',
    waitstaff: 'Tony Romo',
    }*/
//then pass item to the function i.e, updateTableInformation(item)
//this will update the table which is table number 1s 
//the available status will change to false,
//table number will remain 1
//waitstaff will be changed to Tony Romo
export async function updateTableInformation(item) {
    let isSuccess;

    await firebase.firestore().collection('Tables').doc(item.tableNumber).update(item)
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error updating Table in database table: ", error);
        isSuccess = false;
    });

    return isSuccess;
}

// mark a table as needing help (the 'Help' collection, query it to see help status of a table)
export async function getHelp(tableNumber) {
    let isSuccess;

    await firebase.firestore().collection('Help').where('tableNumber', '==', tableNumber).update({helpNeeded: 1})
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error updating Help in database: ", error);
        isSuccess = false;
    });

    return isSuccess;
}

// mark a table as NOT needing help (the 'Help' collection, query it to see help status of a table)
export async function wasHelped(tableNumber) {
    let isSuccess;

    await firebase.firestore().collection('Help').where('tableNumber', '==', tableNumber).update({helpNeeded: 0})
    .then(() => {
        isSuccess = true;
    })
    .catch((error) => {
        console.error("Error updating Help in database: ", error);
        isSuccess = false;
    });

    return isSuccess;
}

// view help status of all tables(the 'Help' collection)
export async function helpStatus() {
    let query;

    await firebase.firestore().collection('Help').get()
    .then(snapshot => {
        query = snapshot.docs.map(doc => doc.data());
    })
    .catch((error) => {
        console.error("Error getting Help info from database: ", error);
        query = null;
    });

    return query;
}