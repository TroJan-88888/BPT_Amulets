<?php
// update.php — เขียน JSON จาก Admin Panel

// ตั้งค่าโฟลเดอร์ JSON
define("DATA_DIR", "../data/");

// ตรวจสอบ method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed";
    exit;
}

// อ่านข้อมูลจาก POST
$raw = file_get_contents("php://input");
if (!$raw) {
    http_response_code(400);
    echo "No Data";
    exit;
}

$json = json_decode($raw, true);
if (!$json || !isset($json['album']) || !isset($json['data'])) {
    http_response_code(400);
    echo "Invalid JSON Format";
    exit;
}

$album = basename($json['album']); // ป้องกัน path traversal
$file = DATA_DIR . $album . ".json";

// เขียนไฟล์ JSON
if (file_put_contents($file, json_encode($json['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo "Success";
} else {
    http_response_code(500);
    echo "Failed to write file";
}
?>
