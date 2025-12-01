async function loadIceAlbums(){
  try{
    const res = await fetch('data/albums3.json');
    const albums = await res.json();

    const container = document.getElementById('albumsContainer');
    if(!container) return;
    const input = document.querySelector('#searchInput');

    function fuzzyMatch(text, keyword) {
      const a=text.toLowerCase(); const b=keyword.toLowerCase();
      return a.includes(b) || levenshtein(a,b)<=2;
    }
    function levenshtein(a,b){ const tmp=[]; for(let i=0;i<=b.length;i++) tmp[i]=[i]; for(let j=0;j<=a.length;j++) tmp[0][j]=j; for(let i=1;i<=b.length;i++){ tmp[i]=[]; for(let j=1;j<=a.length;j++){ tmp[i][j]=b[i-1]===a[j-1]?tmp[i-1][j-1]:Math.min(tmp[i-1][j-1]+1,tmp[i][j-1]+1,tmp[i-1][j]+1); } } return tmp[b.length][a.length]; }

    function render(albumsList){
      container.innerHTML='';
      if(albumsList.length===0){ container.innerHTML='<p>ไม่พบอัลบั้ม</p>'; return; }
      albumsList.forEach(a=>{
        const div=document.createElement('div'); div.className='album-card';
        let audioHTML = a.audio? `<audio controls src="${a.audio}"></audio>` : '';
        div.innerHTML=`<a href="${a.url}" target="_blank"><div class="album-name">${a.name}</div></a>${audioHTML}`;
        container.appendChild(div);
      });
    }

    render(albums);
    if(input){
      input.addEventListener('input', ()=>{ const kw=input.value.trim(); if(!kw){ render(albums); return; } render(albums.filter(x=>fuzzyMatch(x.name,kw))); });
    }

    const voiceBtn = document.getElementById('voiceSearchBtn');
    if(voiceBtn && 'webkitSpeechRecognition' in window){
      const recognition = new webkitSpeechRecognition();
      recognition.lang='th-TH'; recognition.interimResults=false; recognition.maxAlternatives=1;
      voiceBtn.addEventListener('click', ()=>{ recognition.start(); voiceBtn.textContent='🎤 กำลังฟัง...'; });
      recognition.onresult=(e)=>{ const transcript=e.results[0][0].transcript; input.value=transcript; render(albums.filter(x=>fuzzyMatch(x.name,transcript))); voiceBtn.textContent='🎤 ค้นหาด้วยเสียง'; };
      recognition.onerror=()=>{ voiceBtn.textContent='🎤 ค้นหาด้วยเสียง'; };
    }
  }catch(e){ console.error(e); }
}
loadIceAlbums();
