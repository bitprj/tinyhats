window.onload = async () => {

    let url = new URL(window.location.href);
    let password = url.searchParams.get("password");

    if (password != "ilovecats")
        return;

    let resp = await fetch("/api/admin");
    let data = await resp.json();
    addHats(data);
}

function addHats(data) {
    console.log(data);
    let arr = data.result;
    console.log(arr);

    for (let i = 0; i < arr.length; ++i) {
        let obj = arr[i];
        createElements(obj);
    }
}

function createElements(obj) {
    let row = document.createElement("div");
    row.classList.add("row", "mt-4");

    let hatCol = document.createElement("div");
    hatCol.classList.add("col-md-6", "d-flex", "align-items-center", "justify-content-center");
    let hatImg = document.createElement("img");
    hatImg.classList.add("img-fluid", "hat-img");
    hatImg.src = obj.Base64;
    hatImg.alt = obj.Description;
    hatCol.appendChild(hatImg);

    let modCol = document.createElement("div");
    modCol.classList.add("col-md-6", "d-flex", "align-items-center", "justify-content-center");
    let modContainer = document.createElement("div");
    let hatName = document.createElement("h4");
    hatName.innerHTML = obj.Description;
    let approveLink = document.createElement("a");
    approveLink.innerHTML = "Approve"
    approveLink.href = `/api/moderate?id=${obj.ID}&approve=true`;
    approveLink.classList.add("btn", "btn-success", "mr-2");

    let denyLink = document.createElement("a");
    denyLink.innerHTML = "Deny"
    denyLink.href = `/api/moderate?id=${obj.ID}&approve=false`;
    denyLink.classList.add("btn", "btn-danger");

    modContainer.appendChild(hatName);
    modContainer.appendChild(approveLink);
    modContainer.appendChild(denyLink);
    modCol.appendChild(modContainer);

    row.appendChild(hatCol);
    row.appendChild(modCol);
    document.querySelector(".hat-items").appendChild(row);
}
