// ------------------------------------------------------
// admin.js — Admin Panel Controller
// ------------------------------------------------------

let adminAlbum = "default";

document.addEventListener("DOMContentLoaded", () => {
    loadAdminAlbumList();
    loadAdminGallery(adminAlbum);

    document.getElementById("saveBtn").onclick = saveChanges;
    document.getElementById("addBtn").onclick = addItem;
});

// โหลดรายชื่ออัลบั้ม
function loadAdminAlbumList() {
    fetch("json/albums.json")
        .then(r => r.json())
        .then(albums => {
            const sel = document.getElementById("adminAlbum");
            albums.forEach(a => {
                const op = document.createElement("option");
                op.value = a.id;
                op.textContent = a.name;
                sel.appendChild(op);
            });
            sel.onchange = () => {
                adminAlbum = sel.value;
                loadAdminGallery(adminAlbum);
            };
        });
}

// โหลดข้อมูลของอัลบั้มในหน้าแอดมิน
function loadAdminGallery(album) {
    fetch(`json/${album}.json`)
        .then(r => r.json())
        .then(data => renderAdminList(data))
        .catch(() => {
            document.getElementById("adminList").innerHTML =
                "<p>ไม่มีข้อมูล</p>";
        });
}

function renderAdminList(data) {
    const box = document.getElementById("adminList");
    box.innerHTML = "";

    data.forEach((item, i) => {
        box.innerHTML += `
        <div class="admin-item">
            <input class="title" value="${item.title}">
            <textarea class="desc">${item.description}</textarea>
            <input class="image" value="${item.image}">
            <input class="audio" value="${item.audio || ""}" placeholder="ไฟล์เสียง (ไม่จำเป็น)">
            <button onclick="deleteItem(${i})">ลบ</button>
        </div>`;
    });

    window.adminData = data;
}

function addItem() {
    adminData.push({
        title: "ชื่อใหม่",
        description: "รายละเอียด",
        image: "img/your-image.jpg",
        audio: ""
    });
    renderAdminList(adminData);
}

function deleteItem(index) {
    adminData.splice(index, 1);
    renderAdminList(adminData);
}

// บันทึกข้อมูลกลับไป update.php
function saveChanges() {
    fetch("update.php", {
        method: "POST",
        body: JSON.stringify({
            album: adminAlbum,
            data: adminData
        })
    })
        .then(r => r.text())
        .then(txt => alert("บันทึกแล้ว: " + txt))
        .catch(() => alert("ERROR: เขียนไฟล์ไม่ได้"));
}
