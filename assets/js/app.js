const gallery = document.getElementById('gallery');
let albumsData=[];

async function loadAlbums(jsonFile='data/albums1.json'){
  showLoading();
  try{
    const res = await fetch(jsonFile);
    albumsData = await res.json();
    renderAlbums(albumsData);
  }catch(e){
    console.error(e);
    gallery.innerHTML='<p>ไม่สามารถโหลดอัลบั้มได้</p>';
  }
  hideLoading();
}

function renderAlbums(data){
  gallery.innerHTML='';
  data.forEach(a=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`<a href="${a.url}" target="_blank">${a.name}</a>`;
    gallery.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  if(gallery) loadAlbums();
});
