/**
 * PA System - File Upload Functions
 * ใช้ร่วมกันในหน้า complaint, suggestion, compliment
 */

/**
 * อัปเดตการแสดงชื่อไฟล์เมื่อเลือกไฟล์
 * @param {HTMLInputElement} input - input element ของไฟล์
 */
function updateFileName(input) {
  const label = input.closest('label');
  const placeholder = label.querySelector('.file-placeholder');
  const fileName = label.querySelector('.file-name');
  
  if (input.files && input.files[0]) {
    placeholder.classList.add('hidden');
    fileName.textContent = '✓ ' + input.files[0].name;
    fileName.classList.remove('hidden');
  } else {
    placeholder.classList.remove('hidden');
    fileName.classList.add('hidden');
  }
}

/**
 * เพิ่ม file upload item ใหม่
 * @param {string} accentColor - สีหลักของฟอร์ม (red, blue, emerald)
 */
function addFileItem(accentColor = 'blue') {
  const fileList = document.getElementById('file-list');
  const newItem = document.createElement('div');
  newItem.className = 'file-item border border-gray-200 rounded-2xl p-3';
  newItem.innerHTML = `
    <div class="flex items-center gap-3">
      <input type="text" placeholder="ชื่อไฟล์ (ไม่บังคับ)" 
        class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition">
      <label class="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl hover:border-${accentColor}-300 transition cursor-pointer">
        <input type="file" class="hidden" accept="image/*,.pdf,.doc,.docx" onchange="updateFileName(this)">
        <div class="file-placeholder flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <span class="text-xs text-gray-500 whitespace-nowrap">เลือกไฟล์</span>
        </div>
        <span class="file-name text-xs text-green-600 hidden"></span>
      </label>
      <button type="button" onclick="this.closest('.file-item').remove()" class="text-gray-400 hover:text-${accentColor}-500 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;
  fileList.appendChild(newItem);
}

/**
 * เพิ่ม file upload item สำหรับหน้า complaint (สีแดง)
 */
function addFileItemRed() {
  addFileItem('red');
}

/**
 * เพิ่ม file upload item สำหรับหน้า suggestion (สีน้ำเงิน)
 */
function addFileItemBlue() {
  addFileItem('blue');
}

/**
 * เพิ่ม file upload item สำหรับหน้า compliment (สีเขียว)
 */
function addFileItemEmerald() {
  addFileItem('emerald');
}

/**
 * ลบไฟล์ทั้งหมด
 */
function clearAllFiles() {
  const fileList = document.getElementById('file-list');
  if (fileList) {
    fileList.innerHTML = '';
  }
}

/**
 * รับรายการไฟล์ทั้งหมดที่เลือก
 * @returns {Array} รายการไฟล์
 */
function getAllSelectedFiles() {
  const fileInputs = document.querySelectorAll('#file-list input[type="file"]');
  const files = [];
  
  fileInputs.forEach(input => {
    if (input.files && input.files[0]) {
      const nameInput = input.closest('.file-item').querySelector('input[type="text"]');
      files.push({
        file: input.files[0],
        customName: nameInput ? nameInput.value : ''
      });
    }
  });
  
  return files;
}
