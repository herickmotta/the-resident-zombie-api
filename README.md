**TRZ (The Resident Zombie) - Backend**
----
  A api to manage survivors and resources in a apocalyptic scenario.

**Features**

- Sign up a survivor, adding a last location and a inventory
- A survivor can update his last location
- A survivor can add/remove items through trading with another survivor only
- A survivor can flag another survivor as infected, a survivor with 5 or more flags will be marked as infected
- A infected survivor can't trade
- A trade only occurs if the sum of points of both offers match.
- A trade is protected by a transaction to guarantee a safe trade. 


**ENDPOINTS**
https://www.notion.so/THZ-ENDPOINTS-b8d635b7751d4fcfb90fc8eb6fb9c655

**How to run**

- Download zip, or clone rep
- Create a postgres database

- Install postgres if you dont have
- sudo -u postgres psql
- CREATE DATABASE db_name;

- Create a ".env" file following .env.example fields

- "yarn" to install depecencies
- "yarn build" to run migrations
- "yarn seeds" to init resources
- "yarn start" to start listening
- "yarn tests" to start testing

