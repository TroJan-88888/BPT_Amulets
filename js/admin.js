// admin.js — upload updated JSON to GitHub using REST API
// WARNING: Token must be kept private. This client-side approach requires user's personal token.

async function getFileSha(user, repo, path, branch='main', token){
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: token ? { Authorization: `token ${token}` } : {} });
  if(res.ok){
    const j = await res.json();
    return j.sha;
  }
  return null;
}

async function putFileToGitHub(path, contentBase64, message, user, repo, branch='main', token){
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  const sha = await getFileSha(user, repo, path, branch, token);
  const body = { message, content: contentBase64, branch };
  if(sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

function encodeToBase64(obj){
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2))));
}

document.addEventListener('DOMContentLoaded', ()=> {
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  if(!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    const name = document.getElementById('albumName').value.trim();
    const url = document.getElementById('albumUrl').value.trim();
    const target = document.getElementById('targetJson').value;
    const audio = document.getElementById('audioPath').value.trim();
    const user = document.getElementById('ghUser').value.trim();
    const repo = document.getElementById('ghRepo').value.trim();
    const branch = document.getElementById('ghBranch').value.trim() || 'main';
    const token = document.getElementById('ghToken').value.trim();

    if(!name || !url || !user || !repo || !token){
      status.textContent = 'กรุณากรอกข้อมูลให้ครบ (name, url, user, repo, token)';
      return;
    }

    status.textContent = 'กำลังดึงไฟล์ JSON เดิม...';
    try{
      const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${target}`;
      let existing = [];
      const r = await fetch(rawUrl);
      if(r.ok){
        existing = await r.json();
      } else {
        existing = [];
      }

      const item = { name, url };
      if(audio) item.audio = audio;
      existing.push(item);

      const contentBase64 = encodeToBase64(existing);
      status.textContent = 'กำลังอัปเดตไปยัง GitHub...';

      const resp = await putFileToGitHub(target, contentBase64, `Add album ${name}`, user, repo, branch, token);

      if(resp.content){
        status.textContent = 'อัปเดตสำเร็จแล้ว ✓';
      } else {
        status.textContent = 'เกิดข้อผิดพลาด: ' + (resp.message || 'unknown');
      }

    }catch(err){
      console.error(err);
      status.textContent = 'อัปเดตไม่สำเร็จ: ' + (err.message || err);
    }
  });
});
