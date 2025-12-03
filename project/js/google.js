// google.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("json/google.json")
        .then(r => r.json())
        .then(data => {
            document.getElementById("googleList").innerHTML =
                data.map(i => `<li><a href="${i.url}" target="_blank">${i.name}</a></li>`).join("");
        });
});
