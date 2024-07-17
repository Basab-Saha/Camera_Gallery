

//accessing the video element (1)
let video=document.querySelector('video');

//accessing the record and capture buttons and their containers // 5
let recordBtnCont=document.querySelector(".record-btn-cont")
let captureBtnCont=document.querySelector(".capture-btn-cont")

let recordBtn=document.querySelector(".record-btn")
let captureBtn=document.querySelector(".capture-btn")
let recorder;
let recordFlag=false;
let canvasColor="transparent";

//constraints for the video (audio and video thakbe) // (2)
let constraints={    
    video:true, 
    audio:true,

}

//recording er data(stream) store korar jonyo ekta array lgbe
//ebar youtube jokhon dekhi tokhon ekbare slider sada hoa jai na
//age ektu khani ase , then abar pore ektu khani ase
//ei vabe chunk by chunk data in form of stream ase
let chunks=[];


//browser er info debe , its a window global object's property
/*
The MediaDevices interface of the Media Capture and
 Streams API provides access to connected media input devices 
 like cameras and microphones, as well as screen sharing. 
 In essence, it lets you obtain access to any hardware source of media data.
*/
function generateShortId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

navigator.mediaDevices.getUserMedia(constraints) // (3)
.then( (stream)=>{
    video.srcObject=stream; //(3)

    
    //MediaRecorder er instance lgbe tobei record hobe
    recorder=new MediaRecorder(stream);  // (4)


    //(7)
    //recorder start korle , age thekei chunks array ta empty hobe
    recorder.addEventListener("start",(e)=>{ 
        chunks=[]; //clear the chunks
        
    } )
    //this is just a event listener , it will not start recording
    //it says that whenever some data is been recorded
    //store it in the chunks array
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })

    
    //recorder stop hole recording je data ache chunk array te
    //seta ke ekta video file e convert kore download korbe
    recorder.addEventListener("stop",(e)=>{
        
        //stored data ke convert koro into -->video

        //er jonyo best method holo Blob
        let blob=new Blob(chunks,{type:"video/mp4"});

        if(db){
            //make a transaction request to the video object store
            let dbTransaction=db.transaction("video","readwrite");
            console.log("doing transaction");

            let videoStore=dbTransaction.objectStore("video");
           
            let videoID=generateShortId(8);
            let videoEntry={
                id:`vid-${videoID}`,
                blobData:blob,
               
            }
            videoStore.add(videoEntry);
        }


        //blob er url create koro
       /*  let videoURL=URL.createObjectURL(blob);

        let a=document.createElement("a");
        a.href=videoURL;
        a.download="video.mp4";
        a.click();
 */
    })
} )

//opor e eta kintu ekta promise , mane jodi stream ase tobei recorder
//instanciated hobe nahole hobe na jodi camera start i  na kori



//ebar amader stream ta record korte hobe  // 6
recordBtnCont.addEventListener("click",(e)=>{
    //step 1: recorder er instance lgbe
    if(!recorder) return;  //camera start korini akhono

    recordFlag=!recordFlag; //toggle the flag

    if(recordFlag){  //recording start
        recorder.start();
        
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{  //recording stop
       recorder.stop();
       stopTimer();
       recordBtn.classList.remove("scale-record");
    }
})

//timerID is a global variable , it will store the setInterval id
let timerID;
let counter=0;
let timer=document.querySelector(".timer");

function startTimer(){


    //display timer fxn ta counter++ korbe and sekhan theke hr:mi:secs e
    //divide kore display korbe screen e timer e
    //ei display fxn ta per 1sec ontor ontor call hobe
    function displayTimer(){
        let hours=Number.parseInt(counter/3600);
        let minutes=Number.parseInt((counter%3600)/60);
        let seconds=Number.parseInt(counter%60);
        if(hours<10) hours="0"+hours;
        if(minutes<10) minutes="0"+minutes;
        if(seconds<10) seconds="0"+seconds;
        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }

    //per 1sec e displayTimer fxn ta call hobe
    timerID=setInterval(displayTimer,1000);
}

function stopTimer(){
    //recording stop korle age oi 1sec interval e chola display fxn ta stop koro
    //mane setInterval ta clear koro
    clearInterval(timerID);
    
    //timer ke abar 00:00:00 set kore dao
    timer.innerText="00:00:00";

    //counter ke abar 0 kore dao
    counter=0;
}

//capture btn cont e click korle video er image capture hobe
//tool.drawImage(video,0,0,canvas.width,canvas.height);
//this line will capture the image of the video at the moment of click
//and draw it on the canvas from 0,0 with width of canvas.width and height of canvas.height

captureBtnCont.addEventListener("click",(e)=>{
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    //filtering:(whenever clicked on capture button)
    tool.fillStyle=canvasColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL=canvas.toDataURL();

    if(db){
        //make a transaction request to the video object store
        let dbTransaction=db.transaction("image","readwrite");
        console.log("doing transaction");

        let imageStore=dbTransaction.objectStore("image");
       
        let imageID=generateShortId(8);
        let imageEntry={
            id:`img-${imageID}`,
            blobData:imageURL,
           
        }
        imageStore.add(imageEntry);
    }

    /* 

    let a=document.createElement("a");
    a.href=imageURL;
    a.download="image.jpg";
    a.click(); */
})

//filtering
let filterLayer=document.querySelector(".filter-layer");
let filterElements=document.querySelectorAll(".filter");
filterElements.forEach((filterElement)=>{

    filterElement.addEventListener("click",(e)=>{
        canvasColor=getComputedStyle(filterElement).backgroundColor;
        
        filterLayer.style.backgroundColor=canvasColor;
        
    })
})