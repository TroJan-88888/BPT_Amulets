// icedrive.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("json/icedrive.json")
        .then(r => r.json())
        .then(data => {
            document.getElementById("icedriveList").innerHTML =
                data.map(i => `<li><a href="${i.url}" target="_blank">${i.name}</a></li>`).join("");
        });
});
