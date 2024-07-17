setTimeout(()=>{

    if(db){
        //video retrival
        //image retrival
    
        let dbTransaction=db.transaction("video","readonly");
        let videoStore=dbTransaction.objectStore("video");
        //access all videos , it returns a request
        let videoRequest=videoStore.getAll();

       // alert("video retrival");
        videoRequest.onsuccess=(e)=>{
            let videoResult = videoRequest.result;
            let gallery=document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj)=>{
                let mediaElem=document.createElement("div");
               mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);
                let url=URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML=`
                

                    <div class="media">
                         <video autoplay loop src="${url}" autoplay></video>
                     </div>

                     <div class="delete actionBtn">Delete</div>

                     <div class="download actionBtn">Download</div>

                 
                `
                gallery.appendChild(mediaElem);

                  // Listeners
                  let deleteBtn = mediaElem.querySelector(".delete");
                  deleteBtn.addEventListener("click", deleteListener);
                  let downloadBtn = mediaElem.querySelector(".download");
                  downloadBtn.addEventListener("click", downloadListener);
          

            })

           

        }



        //image retrival
       dbTransaction=db.transaction("image","readonly");
        let imageStore=dbTransaction.objectStore("image");
        //access all videos , it returns a request
        let imageRequest=imageStore.getAll();

        //alert("image retrival");
        imageRequest.onsuccess=(e)=>{
            let imageResult = imageRequest.result;
            let gallery=document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj)=>{
                let mediaElem=document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);
                
                mediaElem.innerHTML=`
              

                    <div class="media">
                         <img  src="${imageObj.blobData}" />
                     </div>

                     <div class="delete actionBtn">Delete</div>

                     <div class="download actionBtn">Download</div>
                     
               
                `
                gallery.appendChild(mediaElem);

                
                 // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
          
            })

           
        }
    }

},100)

function deleteListener(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // UI removal
    e.target.parentElement.remove();

}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a=document.createElement("a");
            a.href=imageResult.blobData;
            a.download="image.jpg";
            a.click();
        }
    }
}

