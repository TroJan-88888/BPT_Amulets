// ------------------------------------------------------
// app.js — Main Gallery Loader + UI Controller
// ------------------------------------------------------

let galleryData = {};
let currentAlbum = "default";

document.addEventListener("DOMContentLoaded", () => {
    loadAlbumList();
    loadGallery(currentAlbum);
    initDarkMode();
});

// โหลดรายชื่ออัลบั้มจาก albums.json
function loadAlbumList() {
    fetch("json/albums.json")
        .then(res => res.json())
        .then(albums => {
            const tab = document.getElementById("albumTabs");
            albums.forEach(album => {
                const btn = document.createElement("button");
                btn.className = "album-tab";
                btn.innerText = album.name;
                btn.onclick = () => {
                    currentAlbum = album.id;
                    loadGallery(album.id);
                };
                tab.appendChild(btn);
            });
        });
}

// โหลดรูปตามอัลบั้ม
function loadGallery(album) {
    fetch(`json/${album}.json`)
        .then(res => res.json())
        .then(data => {
            galleryData = data;
            renderGallery(data);
        })
        .catch(() => {
            document.getElementById("gallery").innerHTML =
                `<p style="padding:20px;text-align:center">ไม่มีข้อมูลในอัลบั้มนี้</p>`;
        });
}

// แสดงรูป
function renderGallery(data) {
    const container = document.getElementById("gallery");
    container.innerHTML = "";

    data.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onclick="openModal(${index})">
            <div class="title">${item.title}</div>
        `;
        container.appendChild(div);
    });
}

// Modal ดูภาพเต็ม
function openModal(index) {
    const item = galleryData[index];
    const modal = document.getElementById("imageModal");

    document.getElementById("modalImage").src = item.image;
    document.getElementById("modalTitle").innerText = item.title;
    document.getElementById("modalDesc").innerText = item.description;

    modal.style.display = "flex";

    // เล่นเสียงอธิบาย (ถ้ามี)
    if (item.audio) {
        const audio = document.getElementById("voicePlayer");
        audio.src = item.audio;
        audio.play();
    }
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Dark Mode
function initDarkMode() {
    const btn = document.getElementById("toggleDark");
    btn.onclick = () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("dark", document.body.classList.contains("dark"));
    };

    if (localStorage.getItem("dark") === "true") {
        document.body.classList.add("dark");
    }
}
