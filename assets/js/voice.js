function startVoice(){
  if(!('webkitSpeechRecognition' in window)) return alert('Browser ไม่รองรับ Voice');
  const recognition = new webkitSpeechRecognition();
  recognition.lang='th-TH';
  recognition.onresult=function(e){
    const transcript = e.results[0][0].transcript;
    const album = albumsData.find(a=>transcript.includes(a.name));
    if(album){
      alert(`ผมเปิดพระที่เจ้านายหาให้แล้วครับ: ${album.name}`);
      window.open(album.url,'_blank');
    }else{
      alert('ไม่พบอัลบั้มที่พูด');
    }
  }
  recognition.start();
}

if(gallery){
  const voiceBtn = document.createElement('button');
  voiceBtn.textContent='🎤 พูดชื่ออัลบั้ม';
  voiceBtn.className='button';
  voiceBtn.onclick=startVoice;
  gallery.parentNode.insertBefore(voiceBtn,gallery);
}
