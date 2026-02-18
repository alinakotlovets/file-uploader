const folderForm = document.querySelector(".folder-form");
const addFolderBtn = document.getElementById("add-folder-btn");
const closeFormBtn = document.getElementById("cansel-btn");
const folderList = document.querySelector(".folder-list");
const pageContent = document.getElementById('page-content');
const pageContentTitle = document.createElement("h2");
const errorText = document.createElement("p");
folderForm.append(errorText);
let activeFolder = null;


function chooseActiveFolder(folderName, folderId, files = []){
    const creatFileBox = document.createElement("div");
    creatFileBox.classList.add("add-file-box")
    const createFileText = document.createElement("h3");
    const fileList = document.createElement("ul");
    fileList.classList.add("file-list-box")
    createFileText.innerText = `Add file to ${folderName} folder`
    const link = document.createElement("a");
    link.classList.add("add-file-btn")
    creatFileBox.append(createFileText, link);

    link.innerHTML = "+";
    link.href = `/files/upload-file/${folderId}`;


    pageContent.innerHTML = "";
    pageContentTitle.innerText = `You now in ${folderName}:`
    pageContentTitle.classList.add("right-box-title");
    pageContent.append(creatFileBox, pageContentTitle);
    if(files.length === 0){
        pageContentTitle.innerText = `Folder ${folderName} empty. Add files to see them.`
    } else {
        files.forEach((file)=>{
            const fileListItem = document.createElement("li");
            fileListItem.classList.add("file-list-item")
            const fileTitle = document.createElement("a");
            fileTitle.href = `/files/${file.id}/download`
            const detailLink = document.createElement("a");
            detailLink.href = `/files/${file.id}`;
            detailLink.innerText = "Detail";
            detailLink.classList.add("detail-btn")
            fileTitle.innerText = `${file.fileName}`;
            fileListItem.append(fileTitle, detailLink);
            fileList.append(fileListItem);
        })
        pageContent.append(fileList);
    }
}

function noActiveFolder(){
    activeFolder = null;
    pageContent.innerHTML = "";
    pageContentTitle.innerText = 'Create or choose folder to see content in them';
    pageContent.appendChild(pageContentTitle);
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("Link copied");
    }).catch(err => {
        console.error('Failed to copy link: ', err);
    });
}

if(folderList){
    folderList.addEventListener("click", async (e)=>{
        if(e.target.closest("button")) return;
        const folderListItem = e.target.closest(".folder-list-item");
        if(!folderListItem) return;
        e.preventDefault();
        const folderId =  folderListItem.querySelector(".folder-list-item-title").dataset.folderId;
        activeFolder = {
            folderName: folderListItem.querySelector(".folder-list-item-title").innerText,
            folderId: folderId
        }

        const response = await fetch(`/files/${folderId}/files`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const data = await response.json();
        if(data.files){
            chooseActiveFolder(activeFolder.folderName, activeFolder.folderId, data.files);
        }
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
            if(activeFolder && activeFolder.folderId === folderId){
                noActiveFolder();
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

    folderList.addEventListener("click", async (e)=>{
        const shareBtn = e.target.closest(".share-folder-btn");
        if(!shareBtn) return;
        e.preventDefault();
        const folderId = shareBtn.dataset.folderId;

        const response = await fetch(`/folder/share`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                folderId: folderId
            })
        })

        const data = await response.json();
        if(data.token){
            copyLink(`${window.location.origin}/folder/share/${data.token}`)
        }
    })
}

addFolderBtn.addEventListener("click", ()=>{
    folderForm.style.display = "flex";
    folderForm.action = "/folder";
    folderForm.method = "POST"
})

closeFormBtn.addEventListener("click",()=>{
    folderForm.style.display = "none";
    folderForm.action = "";
    errorText.innerText = "";
    folderForm.querySelector("#folderName").value = "";
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
        if(data.folder){
            errorText.innerText = "";
            const newLi = document.createElement("li");
            newLi.classList.add("folder-list-item");
            newLi.innerHTML = `
                    <h3 class="folder-list-item-title" data-folder-id="${data.folder.id}">${data.folder.folderName}</h3>
                    <div class="folder-list-item-btn-box">
                    <button class="delete-folder-btn red-btn" data-folder-id="${data.folder.id}">
                        <img src="/images/delete.svg" alt="delete icon" width="15" height="15">
                    </button>
                    <button class="edit-folder-btn" data-folder-id="${data.folder.id}">
                        <img src="/images/edit.svg" alt="edit icon"  width="15" height="15">
                    </button>
                    <button class="share-folder-btn blue-btn" data-folder-id="${data.folder.id}">
                        <img src="/images/share.svg" alt="share icon" width="15" height="15">
                    </button>
                    </div>
        `;
            folderList.appendChild(newLi);
            folderForm.style.display = "none";
            folderForm.querySelector("#folderName").value = "";
        }
        if(data.message){
            errorText.innerText = "";
            errorText.innerText = data.message;
        }

    } else {
        response = await fetch(folderForm.action, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                folderName: document.getElementById("folderName").value,
            })
        })
        data = await response.json();
        if(data.folder){
            errorText.innerText = "";
            if(activeFolder && Number(activeFolder.folderId) === data.folder.id){
                activeFolder.folderName = data.folder.folderName;
                chooseActiveFolder(data.folder.folderName, data.folder.id);
            }
            const liTitle = folderList.querySelector(`.folder-list-item-title[data-folder-id="${data.folder.id}"]`);
            if(liTitle) liTitle.innerText = data.folder.folderName;
            folderForm.style.display = "none";
            folderForm.querySelector("#folderName").value = "";
        }
        if(data.message){
            errorText.innerText = "";
            errorText.innerText = data.message;
        }
    }
})



noActiveFolder();