let db;

let openRequest=indexedDB.open("myDB")
//3 listeners:
openRequest.addEventListener("success",(e)=>{
    
    console.log("DB successfully opened");
    db=openRequest.result;
});
openRequest.addEventListener("error",(e)=>{
    console.log("Error opening DB");
});
openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("DB upgraded and also for initial creation");
  
    db=openRequest.result;

    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});
});


