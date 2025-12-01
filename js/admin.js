// --- ฟังก์ชัน fuzzy search ---
function fuzzyMatch(text, keyword) {
  const a = text.toLowerCase();
  const b = keyword.toLowerCase();
  return a.includes(b) || levenshtein(a,b) <= 2;
}

function levenshtein(a,b){
  const tmp = [];
  for(let i=0;i<=b.length;i++) tmp[i] = [i];
  for(let j=0;j<=a.length;j++) tmp[0][j]=j;
  for(let i=1;i<=b.length;i++){
    tmp[i] = [];
    for(let j=1;j<=a.length;j++){
      tmp[i][j] = b[i-1]===a[j-1]? tmp[i-1][j-1] : Math.min(tmp[i-1][j-1]+1, tmp[i][j-1]+1, tmp[i-1][j]+1);
    }
  }
  return tmp[b.length][a.length];
}

// --- โหลด JSON ทุกไฟล์ ---
async function loadAllAlbums(){
  const files = [1,2,3,4,5];
  let all = [];
  for(const f of files){
    try{
      const res = await fetch(`data/albums${f}.json`);
      const js = await res.json();
      all = all.concat(js);
    } catch(e){ console.warn(`ไม่สามารถโหลด albums${f}.json`,e); }
  }
  return all;
}

// --- render albums + audio ---
function renderAlbums(albums){
  const container = document.getElementById('albumsContainer');
  if(!container) return;
  container.innerHTML = '';
  if(albums.length===0){ container.innerHTML='<p>ไม่พบอัลบั้ม</p>'; return; }
  albums.forEach(a=>{
    const div = document.createElement('div');
    div.className='album-card';
    let audioHTML = a.audio? `<audio controls src="${a.audio}"></audio>` : '';
    div.innerHTML=`
      <a href="${a.url}" target="_blank"><div class="album-name">${a.name}</div></a>
      ${audioHTML}
    `;
    container.appendChild(div);
  });
}

// --- Setup Search + Voice Search ---
async function setupSearch(){
  const input = document.querySelector('#searchInput');
  const albums = await loadAllAlbums();
  renderAlbums(albums);

  if(input){
    input.addEventListener('input', ()=>{
      const kw = input.value.trim();
      if(!kw){ renderAlbums(albums); return; }
      const filtered = albums.filter(item=>fuzzyMatch(item.name,kw));
      renderAlbums(filtered);
    });
  }

  const voiceBtn = document.getElementById('voiceSearchBtn');
  if(voiceBtn && 'webkitSpeechRecognition' in window){
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceBtn.addEventListener('click', ()=>{
      recognition.start();
      voiceBtn.textContent = '🎤 กำลังฟัง...';
    });

    recognition.onresult = (event)=>{
      const transcript = event.results[0][0].transcript;
      if(input){
        input.value = transcript;
        const filtered = albums.filter(item=>fuzzyMatch(item.name, transcript));
        renderAlbums(filtered);
      }
      voiceBtn.textContent = '🎤 ค้นหาด้วยเสียง';
    };

    recognition.onerror = ()=>{
      voiceBtn.textContent = '🎤 ค้นหาด้วยเสียง';
    };
  } else if(voiceBtn){
    voiceBtn.disabled = true;
    voiceBtn.textContent = 'ไมโครโฟนไม่รองรับ';
  }
}

setupSearch();
