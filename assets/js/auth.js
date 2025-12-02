// ตรวจสอบ login
function checkAdmin(){
  if(localStorage.getItem('adminLogged') !== 'true'){
    window.location.href='login.html';
  }
}

// Login function
function loginAdmin(password){
  const ADMIN_PWD = 'admin123'; // รหัสผ่าน
  if(password === ADMIN_PWD){
    localStorage.setItem('adminLogged','true');
    return true;
  }
  return false;
}

// Logout
function logoutAdmin(){
  localStorage.removeItem('adminLogged');
  window.location.href='login.html';
}
