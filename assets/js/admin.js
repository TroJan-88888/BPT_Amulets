checkAdmin(); // เช็ค login

let albums = JSON.parse(localStorage.getItem('albums')) || [];
const albumList = document.getElementById('albumList');
const addForm = document.getElementById('addForm');

function renderAdminAlbums(){
  albumList.innerHTML='';
  albums.forEach((a,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      ${a.name} - <a href="${a.url}" target="_blank">เปิด</a>
      <button onclick="deleteAlbum(${i})">ลบ</button>
    `;
    albumList.appendChild(li);
  });
}

function deleteAlbum(i){
  if(confirm('คุณต้องการลบอัลบั้มนี้?')){
    albums.splice(i,1);
    localStorage.setItem('albums',JSON.stringify(albums));
    renderAdminAlbums();
  }
}

if(addForm){
  addForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('albumName').value;
    const url = document.getElementById('albumURL').value;
    albums.push({name,url});
    localStorage.setItem('albums',JSON.stringify(albums));
    addForm.reset();
    renderAdminAlbums();
  });
}

renderAdminAlbums();
