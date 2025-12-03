// mega.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("json/mega.json")
        .then(r => r.json())
        .then(data => {
            document.getElementById("megaList").innerHTML =
                data.map(i => `<li><a href="${i.url}" target="_blank">${i.name}</a></li>`).join("");
        });
});
