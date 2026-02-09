const folderForm = document.querySelector(".folder-form");
const addFolderBtn = document.getElementById("add-folder-btn");
const closeFormBtn = document.getElementById("cansel-btn");

addFolderBtn.addEventListener("click", ()=>{
    folderForm.style.display = "flex";
    folderForm.action = "/folder";
})

closeFormBtn.addEventListener("click",()=>{
    folderForm.style.display = "none";
    folderForm.action = "";
})


folderForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const response = await fetch(folderForm.action, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            folderName: document.getElementById("folderName").value,
        })

    })
    const data = await response.json();

    if(data.redirectTo){
        window.location = data.redirectTo;
    }
})


