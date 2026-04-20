// JavaScript object: this is a data structure used within js code. it lives in pc's memory while script is running.
// Format: Flexible, keys don't need quotes(unless they have space)
// value can be string, number, function, or even other objects.

// purpose: to store data and logic (functions) locally in a script
// Used within JS code

// it's a data structure
const user = {
  name: "Monir",
  role: "dev",
  age: 23,
  greet: function () {
    console.log("Hi!");
  },
};



// JSON = JavaScript Object Notation

// JSON is a format -- essentially just a string of text.
// it is used to transport data between a server and a web application.
// Format: very strict. Keys must be double-quoted, and it cannot contain function. just text data

// purpose: To act as a universal "language" that different systems(like a Python backend and a React frontend) use to talk to each other
// Used for APIs and data transfer

//Example JSON
// "{\"name\":\"monir\",\"role\":\"dev\"}"     // this is just a text/ a string




//
// 
// there is have two built-in tool used to convert between the two format
// JSON.parse() →  JSON to js obj  
// JSON.stringify() → js obj to JSON string


const user_JSON =  JSON.stringify(user)

console.log(user_JSON);   // print without function. because it cannot contain function


const js_OBJ =  JSON.parse(user_JSON)

console.log(js_OBJ);   // there is no function. because user_JSON have no function




// Essentially, we write js objects to build our app, 
// but we send or receive JSON to communicate with the world.

