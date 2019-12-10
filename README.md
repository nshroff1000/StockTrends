We have three folder directories above.

The client folder is the front-end code.
The backend folder is the back-end code.
The database_population is the code we used to call the APIs to populate the csv files that we loaded into the database. There are two primary scripts: one for retrieving the World Trading Data and the other for retrieving the Google Trends data.

To run the code, you must have an ORACLE client otherwise none of the queries will run or work in the backend.

Then you will need to open two terminal windows up.
In one window, run npm install in the client folder. After this is done, you can run npm start to start the front-end.
In the other window, run npm install in the backend folder. After this is done, you can run nodemon app to start the back-end.

Then go to localhost:3000 to see the application.

The requirements.txt files are found in both the client and backend folders.