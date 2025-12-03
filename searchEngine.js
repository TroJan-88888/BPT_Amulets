// ------------------------------------------------------
// searchEngine.js — Real-time Search
// ------------------------------------------------------

function initSearch() {
    const input = document.getElementById("searchBox");

    input.addEventListener("keyup", () => {
        const keyword = input.value.toLowerCase();
        const items = document.querySelectorAll(".item");

        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            item.style.display = text.includes(keyword) ? "block" : "none";
        });
    });
}

document.addEventListener("DOMContentLoaded", initSearch);
