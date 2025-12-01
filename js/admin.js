document.getElementById('saveBtn').addEventListener('click', async ()=>{
  const name=document.getElementById('albumName').value.trim();
  const url=document.getElementById('albumUrl').value.trim();
  const audio=document.getElementById('albumAudio').value.trim();
  const target=document.getElementById('targetJson').value;
  const user=document.getElementById('ghUser').value.trim();
  const repo=document.getElementById('ghRepo').value.trim();
  const branch=document.getElementById('ghBranch').value.trim()||'main';
  const token=document.getElementById('ghToken').value.trim();
  const status=document.getElementById('status');

  if(!name||!url||!user||!repo||!token){ status.textContent='กรอกข้อมูลไม่ครบ!'; return; }

  try{
    // โหลดไฟล์ JSON ปัจจุบัน
    const res = await fetch(target);
    const albums = await res.json();
    albums.push({name, url, audio});
    
    // Prepare PUT request
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${target.replace('data/','data/')}`;
    const getRes = await fetch(apiUrl+'?ref='+branch, {headers:{Authorization:'token '+token}});
    const getData = await getRes.json();
    const sha = getData.sha;

    const putRes = await fetch(apiUrl, {
      method:'PUT',
      headers:{Authorization:'token '+token, 'Content-Type':'application/json'},
      body: JSON.stringify({
        message:`Add album ${name}`,
        content:btoa(JSON.stringify(albums,null,2)),
        branch: branch,
        sha: sha
      })
    });

    if(putRes.ok){ status.textContent='อัปโหลดสำเร็จ!'; } 
    else{ status.textContent='อัปโหลดล้มเหลว!'; console.error(await putRes.text()); }
  } catch(e){ console.error(e); status.textContent='เกิดข้อผิดพลาด!'; }
});
