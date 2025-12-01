document.getElementById('saveBtn').addEventListener('click', async () => {
  const name = document.getElementById('albumName').value.trim();
  const url = document.getElementById('albumUrl').value.trim();
  const audio = document.getElementById('albumAudio').value.trim();
  const targetJson = document.getElementById('targetJson').value.trim();
  const user = document.getElementById('ghUser').value.trim();
  const repo = document.getElementById('ghRepo').value.trim();
  const branch = document.getElementById('ghBranch').value.trim() || 'main';
  const token = document.getElementById('ghToken').value.trim();
  const status = document.getElementById('status');

  if(!name || !url || !audio || !targetJson || !user || !repo || !token){
    status.textContent = "❌ กรุณากรอกข้อมูลให้ครบทุกช่อง!";
    return;
  }

  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${targetJson}?ref=${branch}`;
  status.textContent = "⏳ กำลังตรวจสอบและบันทึก...";

  try {
    // ตรวจสอบไฟล์ JSON และ Token
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${token}` }
    });

    if(res.status === 404){
      status.textContent = "❌ ไม่พบไฟล์ JSON หรือ path/branch ผิด!";
      return;
    }
    if(res.status === 401){
      status.textContent = "❌ Token ผิดหรือไม่มีสิทธิ์ repo!";
      return;
    }

    const data = await res.json();
    const content = JSON.parse(atob(data.content));

    // เพิ่มอัลบั้มใหม่
    content.push({ name, url, audio });

    // อัปโหลดกลับ GitHub
    const uploadRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add album ${name}`,
        content: btoa(JSON.stringify(content, null, 2)),
        sha: data.sha,
        branch: branch
      })
    });

    if(uploadRes.ok){
      status.textContent = "✅ Success! JSON updated.";
    } else {
      const err = await uploadRes.json();
      status.textContent = "❌ Upload failed: " + (err.message || "Unknown error");
    }

  } catch(err) {
    console.error(err);
    status.textContent = "❌ Error: " + err.message;
  }
});
