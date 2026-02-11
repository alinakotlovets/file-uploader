const folderForm = document.querySelector(".folder-form");
const addFolderBtn = document.getElementById("add-folder-btn");
const closeFormBtn = document.getElementById("cansel-btn");
const folderList = document.querySelector(".folder-list");
const pageContent = document.getElementById('page-content');
const pageContentTitle = document.createElement("h2");
let activeFolder = null;




folderList.addEventListener("click", (e)=>{
    const folderListItem = e.target.closest(".folder-list-item");
    if(!folderListItem) return;
    e.preventDefault();
    const folderId =  folderListItem.querySelector(".folder-list-item-title").dataset.folderId;
    activeFolder = {
        folderName: folderListItem.querySelector(".folder-list-item-title").innerText,
        folderId: folderId
    }
    pageContent.innerHTML = "";
    pageContentTitle.innerText = `You now in ${activeFolder.folderName}`
    pageContent.appendChild(pageContentTitle);
})

if(activeFolder === null){
    pageContent.innerHTML = "";
    pageContentTitle.innerText = 'Create or choose folder to see content in them';
    pageContent.appendChild(pageContentTitle);
}
addFolderBtn.addEventListener("click", ()=>{
    folderForm.style.display = "flex";
    folderForm.action = "/folder";
    folderForm.method = "POST"
})

closeFormBtn.addEventListener("click",()=>{
    folderForm.style.display = "none";
    folderForm.action = "";
    folderForm.querySelector("#folderName").value = "";
})
folderList.addEventListener("click", async (e)=>{
    const deleteBtn = e.target.closest(".delete-folder-btn");
    if(!deleteBtn) return;
    e.preventDefault();
    const folderId = deleteBtn.dataset.folderId;
    const response = await fetch(`/folder/${folderId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    })
    const data = await response.json();

    if(response.ok){
        if(activeFolder.folderId === folderId){
            activeFolder = null;
            pageContent.innerHTML = "";
            pageContentTitle.innerText = 'Create or choose folder to see content in them';
            pageContent.appendChild(pageContentTitle);
        }
        deleteBtn.closest(".folder-list-item").remove();
    }
})


folderList.addEventListener("click", (e)=>{
    const editBtn = e.target.closest(".edit-folder-btn");
    if(!editBtn) return;
    e.preventDefault();
    const folderId = editBtn.dataset.folderId;
    const folderListItem = e.target.closest(".folder-list-item");
    folderForm.style.display = "flex";
    folderForm.action = `/folder/${folderId}`;
    folderForm.method = "PUT"
    document.getElementById("folderName").value = folderListItem.querySelector(".folder-list-item-title").innerText;
})


folderForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let response;
    let data;
    if(folderForm.method === "post"){
        response = await fetch(folderForm.action, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                folderName: document.getElementById("folderName").value,
            })
        })
        data = await response.json();
        const newLi = document.createElement("li");
        newLi.classList.add("folder-list-item");
        newLi.innerHTML = `
            <h3 class="folder-list-item-title" data-folder-id="${data.folder.id}">${data.folder.folderName}</h3>
            <button class="delete-folder-btn" data-folder-id="${data.folder.id}">Delete</button>
            <button class="edit-folder-btn" data-folder-id="${data.folder.id}">Edit</button>
        `;
        folderList.appendChild(newLi);
        folderForm.style.display = "none";
        folderForm.querySelector("#folderName").value = "";
    } else {
        response = await fetch(folderForm.action, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                folderName: document.getElementById("folderName").value,
            })
        })
        data = await response.json();
        if(Number(activeFolder.folderId) === data.folder.id){
            activeFolder.folderName = data.folder.folderName;
            pageContent.innerHTML = "";
            pageContentTitle.innerText = `You now in ${data.folder.folderName}`;
            pageContent.appendChild(pageContentTitle);
        }
        const liTitle = folderList.querySelector(`.folder-list-item-title[data-folder-id="${data.folder.id}"]`);
        if(liTitle) liTitle.innerText = data.folder.folderName;
        folderForm.style.display = "none";
        folderForm.querySelector("#folderName").value = "";
    }
})



