// app.js — โหลด JSON ทุกไฟล์, แสดงผล, fuzzy search, voice search, dark mode
(async function(){
  const jsonFiles = ['data/albums1.json','data/albums2.json','data/albums3.json','data/albums4.json','data/albums5.json'];

  async function loadAll(){
    let all=[];
    for(const f of jsonFiles){
      try {
        const r = await fetch(f);
        if(r.ok){
          const j = await r.json();
          // attach origin file for reference
          j.forEach(it => it._src = f);
          all = all.concat(j);
        }
      } catch(e){ /* ignore missing */ }
    }
    return all;
  }

  // Levenshtein for fuzzy tolerance
  function levenshtein(a,b){
    if(!a.length) return b.length;
    if(!b.length) return a.length;
    const matrix = Array.from({length: b.length+1}, (_,i)=>[]);
    for(let i=0;i<=b.length;i++) matrix[i][0]=i;
    for(let j=0;j<=a.length;j++) matrix[0][j]=j;
    for(let i=1;i<=b.length;i++){
      for(let j=1;j<=a.length;j++){
        const cost = b[i-1] === a[j-1] ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i-1][j]+1, matrix[i][j-1]+1, matrix[i-1][j-1]+cost);
      }
    }
    return matrix[b.length][a.length];
  }
  function fuzzyMatch(text, keyword){
    if(!keyword) return true;
    text = (text||'').toString().toLowerCase();
    keyword = keyword.toString().toLowerCase();
    if(text.includes(keyword)) return true;
    return levenshtein(text, keyword) <= 2;
  }

  // render helper
  function createCard(album){
    const div = document.createElement('div');
    div.className='card';
    const a = document.createElement('a');
    a.href = album.url;
    a.target = '_blank';
    a.textContent = album.name;
    div.appendChild(a);

    if(album.audio){
      const b = document.createElement('button');
      b.className='audio-btn';
      b.textContent='▶ ฟังเสียงบรรยาย';
      b.addEventListener('click', ()=> new Audio(album.audio).play());
      div.appendChild(b);
    }
    return div;
  }

  function renderAlbums(list, containerId='results'){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML='';
    if(!list || list.length===0){
      container.innerHTML = '<p>ไม่พบรายการ</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    for(const a of list){
      frag.appendChild(createCard(a));
    }
    container.appendChild(frag);
  }

  // load and setup search in pages that have #searchInput
  const allAlbums = await loadAll();
  // default render on index (if exists)
  renderAlbums(allAlbums, 'results');

  // If this page has a gallery container with a specific id, render subset
  // googleGallery -> show items where url contains 'photos.google' OR source file albums1.json
  if(document.getElementById('googleGallery')){
    const subset = allAlbums.filter(x => x._src && x._src.endsWith('albums1.json') || /photos.google/.test(x.url));
    renderAlbums(subset, 'googleGallery');
  }
  if(document.getElementById('megaGallery')){
    const subset = allAlbums.filter(x => x._src && x._src.endsWith('albums2.json') || /mega.nz/.test(x.url));
    renderAlbums(subset, 'megaGallery');
  }
  if(document.getElementById('iceGallery')){
    const subset = allAlbums.filter(x => x._src && x._src.endsWith('albums3.json') || /icedrive.net/.test(x.url));
    renderAlbums(subset, 'iceGallery');
  }

  // search input behavior
  const searchInput = document.getElementById('searchInput');
  if(searchInput){
    let timeout;
    searchInput.addEventListener('input', ()=>{
      clearTimeout(timeout);
      timeout = setTimeout(()=>{
        const kw = searchInput.value.trim();
        if(!kw){
          renderAlbums(allAlbums, document.getElementById('results') ? 'results' : (document.getElementById('googleGallery') ? 'googleGallery' : 'results'));
          return;
        }
        const filtered = allAlbums.filter(item => fuzzyMatch(item.name, kw));
        // determine which container to update
        const targetId = document.getElementById('results') ? 'results' :
                         document.getElementById('googleGallery') ? 'googleGallery' : 'results';
        renderAlbums(filtered, targetId);
      }, 180);
    });
  }

  // Dark mode toggle
  const darkToggle = document.getElementById('darkToggle');
  if(darkToggle){
    const saved = localStorage.getItem('bpt_theme');
    if(saved === 'light') document.body.classList.add('light');
    darkToggle.addEventListener('click', ()=>{
      document.body.classList.toggle('light');
      localStorage.setItem('bpt_theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
  }

  // Voice search (uses Web Speech API)
  const voiceBtn = document.getElementById('voiceBtn');
  if(voiceBtn){
    let recognition;
    if('webkitSpeechRecognition' in window) recognition = new webkitSpeechRecognition();
    else if('SpeechRecognition' in window) recognition = new SpeechRecognition();

    if(recognition){
      recognition.lang = 'th-TH';
      recognition.continuous = false;
      recognition.interimResults = false;
      voiceBtn.addEventListener('click', ()=>{
        try{
          recognition.start();
          voiceBtn.textContent = '🎙️ ฟังอยู่...';
          voiceBtn.style.background = '#ff8800';
        }catch(e){}
      });
      recognition.onresult = (evt)=>{
        const text = evt.results[0][0].transcript.trim();
        voiceBtn.textContent='🎤';
        voiceBtn.style.background='';
        if(searchInput){
          searchInput.value = text;
          searchInput.dispatchEvent(new Event('input'));
        } else {
          alert('ค้นหา: ' + text);
        }
      };
      recognition.onerror = ()=>{
        voiceBtn.textContent='🎤';
        voiceBtn.style.background='';
      };
    } else {
      // hide mic if not supported
      voiceBtn.style.display='none';
    }
  }

})();
