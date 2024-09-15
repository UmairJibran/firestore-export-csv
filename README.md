# Firestore Export CSV

This is a simple script to export Firestore data to CSV. It uses firebase-admin to access Firestore and csv-writer to write CSV files.

## Usage

1. Clone this repository
2. Install dependencies with `yarn install`
3. Create a service account key in the Firebase console and download it as a JSON file (see [here](https://firebase.google.com/docs/admin/setup#initialize-sdk))
4. Set the path to the service account here
```javascript
const serviceAccount = require("PATH-TO-SERVICE-ACCOUNT-KEY.json");
```
5. Execute the script with `node main your-collection-name`
