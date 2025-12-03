project/
│
├── index.html                 # หน้า Gallery หลัก (Select Album + Search + Voice)
├── google.html                # เปิดภาพจาก Google Drive
├── mega.html                  # เปิดภาพจาก MEGA
├── icedrive.html              # เปิดภาพจาก Icedrive
├── admin.html                 # ระบบ Admin Upload/Edit JSON
│
├── manifest.json              # PWA Manifest
├── service-worker.js          # สำหรับ Cache แบบ Offline
│
├── css/
│   └── style.css              # UI, Theme, Dark Mode, Background Blur
│
├── js/
│   ├── app.js                 # Load JSON + Render Gallery + Modal + Voice Narration
│   ├── searchEngine.js        # Fuzzy + Full-text Search + Voice Search
│   ├── google.js              # Viewer Google Drive
│   ├── mega.js                # Viewer MEGA
│   ├── icedrive.js            # Viewer Icedrive
│   └── admin.js               # Login, Upload, Edit JSON, Save to Server
│
├── php/
│   └── update.php             # เขียน JSON จริง (Write File)
│
└── data/
    ├── albums1.json           # อัลบั้มพระเครื่องชุดที่ 1
    ├── albums2.json
    ├── albums3.json
    ├── albums4.json
    └── albums5.json
