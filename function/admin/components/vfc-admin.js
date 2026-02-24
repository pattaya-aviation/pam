/**
 * VFC Admin Page Logic
 * Used by: page/admin_portal/vfc-admin/index.html
 *
 * Contains: tab switching, filters, message detail, mockup data,
 *           panel resizer, date section dividers, and all UI interactions.
 */

// ========================================
// State
// ========================================
let tblFilterType = 'all';
let tblFilterStatus = 'all';
let selectMode = false;

// ========================================
// Mockup Data (fallback when Supabase unavailable)
// ========================================
let mockupMessages = {
  1: {
    id: 1,
    type: "complaint",
    typeThai: "ร้องเรียน",
    typeColor: "red",
    sender: "ไม่ระบุตัวตน",
    senderInitials: "สป",
    date: "03/02/2569 14:32",
    title: "สภาพแวดล้อมในการทำงานไม่เหมาะสม",
    station: "สถานีสุวรรณภูมิ (BKK)",
    department: "ฝ่ายปฏิบัติการภาคพื้น (BG)",
    section: "แผนกบริการผู้โดยสารภาคพื้น (GA)",
    category: "สภาพแวดล้อมในการทำงาน",
    detail:
      "ห้องน้ำสกปรก ไม่มีคนทำความสะอาดเป็นประจำ กลิ่นแรงมาก ไม่มีกระดาษชำระ น้ำไม่ไหล บางห้องประตูล็อคไม่ได้ พนักงานต้องใช้ห้องน้ำของผู้โดยสารแทน ซึ่งไม่เหมาะสม และส่งผลต่อภาพลักษณ์ของบริษัท\n\nนอกจากนี้ ห้องพักพนักงานมีสภาพเสื่อมโทรม เครื่องปรับอากาศเสีย ไม่มีคนซ่อม ทำให้ร้อนมากในตอนกลางวัน พนักงานไม่สามารถพักผ่อนได้อย่างเต็มที่ส่งผลต่อประสิทธิภาพการทำงาน",
    resolution:
      "1. จัดทำความสะอาดห้องน้ำทุก 2 ชั่วโมง\n2. ติดตั้งกล่องใส่กระดาษชำระเพิ่ม\n3. ซ่อมแซมประตูห้องน้ำ\n4. ซ่อมเครื่องปรับอากาศห้องพักพนักงาน",
    status: "pending",
  },
  2: {
    id: 2,
    type: "suggestion",
    typeThai: "เสนอแนะ",
    typeColor: "yellow",
    sender: "Pakin H. (HDQ)",
    senderInitials: "PH",
    date: "02/02/2569 10:15",
    title: "เสนอแนะการปรับปรุงระบบลางาน",
    station: "สำนักงานใหญ่ (HDQ)",
    department: "ฝ่ายทรัพยากรบุคคล (BH)",
    section: "แผนกบริหารงานบุคคล (HA)",
    category: "ระบบการทำงาน",
    detail:
      "อยากให้มีระบบลางานผ่าน App เพราะปัจจุบันต้องกรอกแบบฟอร์มกระดาษ ซึ่งทำให้เสียเวลา และบางครั้งเอกสารหาย หากมี App จะสะดวกมากขึ้น สามารถลาได้ทุกที่ทุกเวลา และหัวหน้าสามารถอนุมัติได้ทันที\n\nนอกจากนี้ควรมีการแจ้งเตือนผ่าน Line หรือ Email เมื่อใบลาได้รับการอนุมัติ",
    resolution: "",
    status: "unread",
  },
  3: {
    id: 3,
    type: "compliment",
    typeThai: "คำชม",
    typeColor: "green",
    sender: "Somchai T. (BKK)",
    senderInitials: "ST",
    date: "01/02/2569 16:45",
    title: "ชมเชยพนักงาน Check-in Counter",
    station: "สถานีสุวรรณภูมิ (BKK)",
    department: "ฝ่ายปฏิบัติการภาคพื้น (BG)",
    section: "แผนกบริการผู้โดยสารภาคพื้น (GA)",
    category: "การให้บริการ",
    detail:
      "พี่แอน GA ให้บริการดีมาก ช่วยเหลือผู้โดยสารที่มีปัญหาบัตรโดยสารอย่างเต็มใจ ไม่หงุดหงิด และยังช่วยประสานงานกับสายการบินให้ ผู้โดยสารประทับใจมาก\n\nอยากให้บริษัทยกย่องพนักงานท่านนี้เป็นแบบอย่างให้พนักงานคนอื่นๆ",
    resolution: "",
    status: "read",
  },
  4: {
    id: 4,
    type: "complaint",
    typeThai: "ร้องเรียน",
    typeColor: "red",
    sender: "Napat W. (CNX)",
    senderInitials: "NW",
    date: "31/01/2569 09:30",
    title: "หัวหน้างานพูดจาไม่เหมาะสม",
    station: "สถานีเชียงใหม่ (CNX)",
    department: "ฝ่ายปฏิบัติการภาคพื้น (BG)",
    section: "แผนกบริการภาคพื้น (GF)",
    category: "พฤติกรรมไม่เหมาะสม",
    detail:
      "ขอร้องเรียนหัวหน้าแผนก GF ที่มักพูดจาดุด่าพนักงานต่อหน้าผู้โดยสาร ซึ่งทำให้พนักงานอับอายและเสียกำลังใจในการทำงาน บางครั้งใช้คำพูดหยาบคาย\n\nพฤติกรรมนี้เกิดขึ้นบ่อยมาก ทำให้พนักงานหลายคนไม่กล้าถามคำถามหรือขอความช่วยเหลือ",
    resolution: "",
    status: "unread",
  },
  5: {
    id: 5,
    type: "suggestion",
    typeThai: "เสนอแนะ",
    typeColor: "yellow",
    sender: "Wichai K. (HKT)",
    senderInitials: "WK",
    date: "30/01/2569 14:20",
    title: "เพิ่มอุปกรณ์ความปลอดภัย",
    station: "สถานีภูเก็ต (HKT)",
    department: "ฝ่ายปฏิบัติการภาคพื้น (BG)",
    section: "แผนกบริการลานจอด (GR)",
    category: "ความปลอดภัย",
    detail:
      "อยากให้เพิ่มเสื้อสะท้อนแสงให้พนักงานลานจอด เพราะเสื้อที่มีอยู่เก่าและสีซีดมาก ในตอนกลางคืนมองเห็นยาก อาจเกิดอุบัติเหตุได้\n\nนอกจากนี้ควรเพิ่มหมวกนิรภัยและถุงมือสำหรับพนักงานที่ต้องทำงานกับสินค้า",
    resolution: "",
    status: "read",
  },
  6: {
    id: 6,
    type: "complaint",
    typeThai: "ร้องเรียน",
    typeColor: "red",
    sender: "ไม่ระบุตัวตน",
    senderInitials: "ไม",
    date: "29/01/2569 11:00",
    title: "เครื่องปรับอากาศเสีย",
    station: "สถานีดอนเมือง (DMK)",
    department: "ฝ่ายอำนวยการ (BE)",
    section: "แผนกธุรการ (EA)",
    category: "สภาพแวดล้อมในการทำงาน",
    detail:
      "แจ้งซ่อมเครื่องปรับอากาศไปแล้วหลายครั้ง แต่ไม่มีคนมาซ่อม ทำให้ห้องทำงานร้อนมาก พนักงานไม่สามารถทำงานได้อย่างมีประสิทธิภาพ\n\nขอให้เร่งดำเนินการซ่อมแซมโดยด่วน",
    resolution: "",
    status: "pending",
  },
};

// ========================================
// Supabase Data Loading
// ========================================

function transformSubmission(row) {
  const typeMap = {
    complaint: { thai: 'ร้องเรียน', color: 'red' },
    suggestion: { thai: 'เสนอแนะ', color: 'yellow' },
    compliment: { thai: 'คำชม', color: 'green' }
  };
  const t = typeMap[row.type] || typeMap.suggestion;
  const sender = row.is_anonymous ? 'ไม่ระบุตัวตน' : (row.reporter_name || 'ไม่ระบุ');
  const initials = sender.substring(0, 2);
  const d = new Date(row.created_at);
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear() + 543} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  return {
    id: row.id,
    type: row.type,
    typeThai: t.thai,
    typeColor: t.color,
    sender: sender,
    senderInitials: initials,
    date: dateStr,
    title: row.subject || (row.detail_text ? row.detail_text.substring(0, 60) : 'ไม่มีหัวข้อ'),
    station: row.detail_station || '',
    department: row.detail_department || '',
    section: row.detail_section || '',
    category: row.category || '',
    detail: row.detail_text || '',
    resolution: row.fix_text || '',
    status: row.status || 'pending',
    trackingNumber: row.tracking_number || '',
    adminResponse: row.admin_response || '',
    attachments: row.attachments ? (typeof row.attachments === 'string' ? JSON.parse(row.attachments) : row.attachments) : []
  };
}

async function loadSubmissions() {
  if (!window.supabaseClient) {
    console.warn('Supabase not ready, using fallback data');
    return;
  }
  try {
    const { data, error } = await window.supabaseClient
      .from('vfc_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Load submissions error:', error);
      return;
    }

    if (data && data.length > 0) {
      mockupMessages = {};
      data.forEach(row => {
        mockupMessages[row.id] = transformSubmission(row);
      });
      // Re-render current view
      try {
        if (typeof renderTableView === 'function') renderTableView();
      } catch (e) { /* view not ready yet */ }
    }
  } catch (err) {
    console.error('Load submissions error:', err);
  }
}

async function submitAdminResponse(id) {
  const textarea = document.getElementById('adminResponseText_' + id);
  if (!textarea) return;
  const response = textarea.value.trim();
  if (!response) {
    alert('กรุณาพิมพ์คำตอบ');
    return;
  }
  if (!window.supabaseClient) {
    alert('Supabase ไม่พร้อม');
    return;
  }
  try {
    const { error } = await window.supabaseClient
      .from('vfc_submissions')
      .update({ admin_response: response })
      .eq('id', id);
    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
      return;
    }
    if (mockupMessages[id]) mockupMessages[id].adminResponse = response;
    alert('✅ ส่งคำตอบสำเร็จ');
    selectMessage(id);
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

async function updateSubmissionStatus(id, newStatus) {
  if (!window.supabaseClient) return;
  try {
    const { error } = await window.supabaseClient
      .from('vfc_submissions')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
      return;
    }
    if (mockupMessages[id]) mockupMessages[id].status = newStatus;
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

// ========================================
// Tab Switching
// ========================================
function switchTab(tab) {
  const inboxView = document.getElementById('viewInbox');
  const tableView = document.getElementById('viewTable');
  // Sync both tab bars
  const tabInbox1 = document.getElementById('tabInbox');
  const tabTable1 = document.getElementById('tabTable');
  const tabInbox2 = document.getElementById('tabInbox2');
  const tabTable2 = document.getElementById('tabTable2');
  if (tab === 'inbox') {
    inboxView.style.display = '';
    tableView.style.display = 'none';
    tabInbox1.classList.add('active');
    tabTable1.classList.remove('active');
    tabInbox2.classList.add('active');
    tabTable2.classList.remove('active');
  } else {
    inboxView.style.display = 'none';
    tableView.style.display = '';
    tabInbox1.classList.remove('active');
    tabTable1.classList.add('active');
    tabInbox2.classList.remove('active');
    tabTable2.classList.add('active');
    renderTableView();
  }
}

// ========================================
// Table View Dropdown Functions
// ========================================
function toggleTblStatusDropdown() {
  const menu = document.getElementById('tblStatusDropdownMenu');
  const arrow = document.getElementById('tblStatusArrow');
  menu.classList.toggle('hidden');
  arrow.style.transform = menu.classList.contains('hidden') ? '' : 'rotate(180deg)';
  // Close other dropdown
  document.getElementById('tblCategoryDropdownMenu').classList.add('hidden');
  document.getElementById('tblCategoryArrow').style.transform = '';
}
function toggleTblCategoryDropdown() {
  const menu = document.getElementById('tblCategoryDropdownMenu');
  const arrow = document.getElementById('tblCategoryArrow');
  menu.classList.toggle('hidden');
  arrow.style.transform = menu.classList.contains('hidden') ? '' : 'rotate(180deg)';
  // Close other dropdown
  document.getElementById('tblStatusDropdownMenu').classList.add('hidden');
  document.getElementById('tblStatusArrow').style.transform = '';
}
function selectTblStatus(value, label) {
  tblFilterStatus = value;
  document.getElementById('tblStatusLabel').textContent = label;
  document.getElementById('tblStatusDropdownMenu').classList.add('hidden');
  document.getElementById('tblStatusArrow').style.transform = '';
  renderTableView();
}
function selectTblCategory(value, label) {
  tblFilterType = value;
  document.getElementById('tblCategoryLabel').textContent = label;
  document.getElementById('tblCategoryDropdownMenu').classList.add('hidden');
  document.getElementById('tblCategoryArrow').style.transform = '';
  renderTableView();
}

// ========================================
// Table View Rendering
// ========================================
function renderTableView() {
  const tbody = document.getElementById('tableViewBody');
  if (!tbody) return;

  const typeLabels = { complaint: 'ร้องเรียน', suggestion: 'เสนอแนะ', compliment: 'คำชม' };
  const typeBadgeClass = { complaint: 'badge-complaint', suggestion: 'badge-suggestion', compliment: 'badge-compliment' };
  const statusLabels = { unread: 'ยังไม่อ่าน', read: 'อ่านแล้ว', pending: 'รอดำเนินการ' };
  const statusBadgeClass = { unread: 'badge-unread', read: 'badge-read', pending: 'badge-pending' };

  const entries = Object.values(mockupMessages);
  const filtered = entries.filter(m => {
    if (tblFilterType !== 'all' && m.type !== tblFilterType) return false;
    if (tblFilterStatus !== 'all' && m.status !== tblFilterStatus) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#9ca3af;">ไม่พบรายการที่ตรงกับตัวกรอง</td></tr>';
  } else {
    tbody.innerHTML = filtered.map((m, i) => `
      <tr onclick="selectMessage(${m.id})">
        <td class="text-xs text-gray-400 font-mono">${m.id}</td>
        <td><span class="badge-pill ${typeBadgeClass[m.type]}">${typeLabels[m.type]}</span></td>
        <td class="font-medium text-gray-800" style="max-width:260px">${m.title}</td>
        <td class="text-xs text-gray-500">${m.category}</td>
        <td class="text-xs text-gray-500">${m.station}</td>
        <td class="text-xs text-gray-500">${m.department.replace(/.*\(/, '').replace(')', '')}</td>
        <td class="text-xs text-gray-600">${m.sender}</td>
        <td class="text-xs text-gray-400">${m.date.split(' ')[0]}</td>
        <td><span class="badge-pill ${statusBadgeClass[m.status] || 'badge-read'}">${statusLabels[m.status] || m.status}</span></td>
      </tr>
    `).join('');
  }
  const countEl = document.getElementById('tblCount');
  if (countEl) countEl.textContent = 'แสดง ' + filtered.length + ' รายการ';
}

// ========================================
// Authentication
// ========================================
const user = sessionStorage.getItem("user");
if (!user) {
  window.location.href = "../../Home/pa-system.html";
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "../../Home/pa-system.html";
}

// Load real data from Supabase on page load
document.addEventListener('DOMContentLoaded', function () {
  loadSubmissions();
});

// ========================================
// Select Mode (Multi-select)
// ========================================
function toggleSelectMode() {
  selectMode = !selectMode;
  const btn = document.getElementById('selectModeBtn');
  const items = document.querySelectorAll('.message-item');

  if (selectMode) {
    btn.classList.add('bg-blue-100', 'text-blue-600');
    btn.classList.remove('hover:bg-gray-100');
    items.forEach(item => {
      const dotIndicator = item.querySelector('.dot-indicator');
      if (dotIndicator) {
        dotIndicator.dataset.prevHtml = dotIndicator.innerHTML;
        dotIndicator.innerHTML = `<input type="checkbox" class="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 cursor-pointer" onclick="event.stopPropagation()">`;
        dotIndicator.style.width = '16px';
      }
    });
  } else {
    btn.classList.remove('bg-blue-100', 'text-blue-600');
    btn.classList.add('hover:bg-gray-100');
    items.forEach(item => {
      const dotIndicator = item.querySelector('.dot-indicator');
      if (dotIndicator && dotIndicator.dataset.prevHtml !== undefined) {
        dotIndicator.innerHTML = dotIndicator.dataset.prevHtml;
        dotIndicator.style.width = '8px';
        delete dotIndicator.dataset.prevHtml;
      }
    });
  }
}

// ========================================
// Message Read/Unread & Pin
// ========================================
function markAsUnread(id) {
  const item = document.querySelector(`.message-item[onclick="selectMessage(${id})"]`);
  if (item) {
    const dotIndicator = item.querySelector('.dot-indicator');
    if (dotIndicator && !dotIndicator.querySelector('.bg-blue-500')) {
      dotIndicator.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>';
    }
  }
}

function toggleUnread(id) {
  const item = document.querySelector(`.message-item[onclick="selectMessage(${id})"]`);
  if (!item) return;
  const dotIndicator = item.querySelector('.dot-indicator');
  if (!dotIndicator) return;
  if (dotIndicator.querySelector('.bg-blue-500')) {
    dotIndicator.innerHTML = '';
  } else {
    dotIndicator.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>';
  }
}

function togglePin(id, svgEl) {
  const item = document.querySelector(`.message-item[onclick="selectMessage(${id})"]`);
  if (!item) return;
  const list = item.parentElement;
  const isPinned = item.dataset.pinned === 'true';
  const pinnedHeader = document.getElementById('pinnedSectionHeader');

  if (isPinned) {
    // Unpin - move back to date section
    item.dataset.pinned = 'false';
    svgEl.setAttribute('fill', 'none');
    svgEl.classList.remove('text-blue-500');
    svgEl.classList.add('text-gray-300');

    // Find the correct date section to return to
    const dateSection = item.dataset.dateSection;
    const sectionHeader = list.querySelector(`.date-section-header[data-section="${dateSection}"]`);
    if (sectionHeader) {
      const nextSibling = sectionHeader.nextElementSibling;
      list.insertBefore(item, nextSibling);
    }

    // Hide pinned header if no more pinned items
    const pinnedItems = list.querySelectorAll('.message-item[data-pinned="true"]');
    if (pinnedItems.length === 0 && pinnedHeader) {
      pinnedHeader.style.display = 'none';
    }
  } else {
    // Pin - move to pinned section
    item.dataset.pinned = 'true';
    svgEl.setAttribute('fill', 'currentColor');
    svgEl.classList.add('text-blue-500');
    svgEl.classList.remove('text-gray-300');

    // Show pinned header
    if (pinnedHeader) {
      pinnedHeader.style.display = '';
      pinnedHeader.insertAdjacentElement('afterend', item);
    } else {
      list.insertBefore(item, list.firstElementChild);
    }
  }
}

// ========================================
// Message Detail Panel
// ========================================
function selectMessage(id) {
  const message = mockupMessages[id];
  if (!message) return;

  // In select mode, toggle checkbox instead of opening message
  if (selectMode) {
    const clickedItem = document.querySelector(
      `.message-item[onclick="selectMessage(${id})"]`,
    );
    if (clickedItem) {
      const checkbox = clickedItem.querySelector('.dot-indicator input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    }
    return;
  }

  // Update active state in message list
  document.querySelectorAll(".message-item").forEach((item) => {
    item.classList.remove("bg-blue-50", "border-l-4");
    item.classList.add("hover:bg-gray-50");
  });

  const clickedItem = document.querySelector(
    `.message-item[onclick="selectMessage(${id})"]`,
  );
  if (clickedItem) {
    clickedItem.classList.add(
      "bg-blue-50",
      "border-l-4",
      `border-l-${message.typeColor}-500`,
    );
    clickedItem.classList.remove("hover:bg-gray-50");

    // Remove unread dot when message is read
    const dotIndicator = clickedItem.querySelector('.dot-indicator');
    if (dotIndicator) {
      dotIndicator.innerHTML = '';
    }
  }

  // Update detail panel
  const detailPanel = document.getElementById("messageDetailPanel");
  if (detailPanel) {
    const typeColorClasses = {
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
    };

    detailPanel.innerHTML = `
              <!-- Detail Header -->
              <div class="px-6 py-4">
                  
                  <h2 class="text-lg font-semibold text-gray-900 mb-3">${message.title}</h2>
                  
                  <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-${message.typeColor}-400 to-${message.typeColor}-600 flex items-center justify-center text-white font-medium text-sm">${message.senderInitials}</div>
                          <div>
                              <span class="text-sm font-medium text-gray-900">${message.sender}</span>
                              <span class="text-sm text-gray-500 ml-2">${message.date}</span>
                          </div>
                      </div>
                      <span class="px-2 py-1 ${typeColorClasses[message.typeColor]} text-xs font-medium rounded-full">${message.typeThai}</span>
                  </div>
              </div>
              
              <!-- Detail Body -->
              <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <!-- Info Grid -->
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <div>
                          <p class="text-xs text-gray-500 mb-1">สถานีที่ร้องเรียน</p>
                          <p class="text-sm font-medium text-blue-600">${message.station}</p>
                      </div>
                      <div>
                          <p class="text-xs text-gray-500 mb-1">ฝ่าย</p>
                          <p class="text-sm font-medium text-gray-900">${message.department}</p>
                      </div>
                      <div>
                          <p class="text-xs text-gray-500 mb-1">แผนก</p>
                          <p class="text-sm font-medium text-gray-900">${message.section}</p>
                      </div>
                      <div>
                          <p class="text-xs text-gray-500 mb-1">หมวดหมู่</p>
                          <p class="text-sm font-medium text-${message.typeColor}-600">${message.category}</p>
                      </div>
                  </div>
                  
                  <!-- Content -->
                  <div class="mb-6">
                      <h3 class="text-sm font-semibold text-gray-900 mb-3">รายละเอียดของเรื่อง${message.typeThai}</h3>
                      <div class="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gray-100">${message.detail}</div>
                  </div>
                  
                  ${message.resolution
        ? `
                  <div class="mb-6">
                      <h3 class="text-sm font-semibold text-gray-900 mb-3">สิ่งที่อยากให้แก้ไข</h3>
                      <div class="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-green-50 p-4 rounded-xl border border-green-100">${message.resolution}</div>
                  </div>
                  `
        : ""
      }
                  
                  <!-- Action Buttons -->
                  <div class="flex items-center gap-3 pt-4">
                      <button class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">ดำเนินการ</button>
                      <button class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">ตอบกลับ</button>
                      <button class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">ส่งต่อ</button>
                  </div>
              </div>
          `;
  }

  // Show mobile detail modal
  const mobileBackdrop = document.getElementById("mobileModalBackdrop");
  const mobileCard = document.getElementById("mobileModalCard");
  const mobileContent = document.getElementById("mobileDetailContent");

  if (mobileBackdrop && mobileCard && mobileContent && window.innerWidth < 1024) {
    const typeColorClasses = {
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
    };

    mobileContent.innerHTML = `
              <!-- Modal Header -->
              <div class="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
                  <button onclick="closeMobileDetail()" class="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                  </button>
                  <span class="text-sm font-medium text-gray-900">รายละเอียด</span>
                  <span class="px-2 py-1 ${typeColorClasses[message.typeColor]} text-xs font-medium rounded-full ml-auto">${message.typeThai}</span>
              </div>
              
              <!-- Modal Scrollable Content -->
              <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
                  <h2 class="text-lg font-bold text-gray-900 mb-3">${message.title}</h2>
                  
                  <!-- Sender Info -->
                  <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-${message.typeColor}-400 to-${message.typeColor}-600 flex items-center justify-center text-white font-medium text-sm">${message.senderInitials}</div>
                      <div>
                          <p class="font-medium text-gray-900 text-sm">${message.sender}</p>
                          <p class="text-xs text-gray-500">${message.date}</p>
                      </div>
                  </div>
                  
                  <!-- Info Cards -->
                  <div class="grid grid-cols-2 gap-2 mb-4">
                      <div class="bg-gray-50 rounded-xl p-2.5">
                          <p class="text-[10px] text-gray-500 mb-0.5">สถานี</p>
                          <p class="text-xs font-medium text-blue-600">${message.station}</p>
                      </div>
                      <div class="bg-gray-50 rounded-xl p-2.5">
                          <p class="text-[10px] text-gray-500 mb-0.5">ฝ่าย</p>
                          <p class="text-xs font-medium text-gray-900">${message.department}</p>
                      </div>
                      <div class="bg-gray-50 rounded-xl p-2.5">
                          <p class="text-[10px] text-gray-500 mb-0.5">แผนก</p>
                          <p class="text-xs font-medium text-gray-900">${message.section}</p>
                      </div>
                      <div class="bg-gray-50 rounded-xl p-2.5">
                          <p class="text-[10px] text-gray-500 mb-0.5">หมวดหมู่</p>
                          <p class="text-xs font-medium text-${message.typeColor}-600">${message.category}</p>
                      </div>
                  </div>
                  
                  <!-- Detail Content -->
                  <div class="mb-4">
                      <h3 class="text-xs font-semibold text-gray-900 mb-2">รายละเอียดของเรื่อง${message.typeThai}</h3>
                      <div class="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-gray-100">${message.detail}</div>
                  </div>
                  
                  ${message.resolution ? `
                  <div class="mb-4">
                      <h3 class="text-xs font-semibold text-gray-900 mb-2">สิ่งที่อยากให้แก้ไข</h3>
                      <div class="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-green-50 p-3 rounded-xl border border-green-100">${message.resolution}</div>
                  </div>
                  ` : ''}
              </div>
              
              <!-- Modal Footer -->
              <div class="border-t border-gray-100 px-4 py-3 flex items-center gap-2 shrink-0 bg-white">
                  <button class="flex-1 px-3 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors">ดำเนินการ</button>
                  <button class="flex-1 px-3 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">ตอบกลับ</button>
                  <button class="flex-1 px-3 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">ส่งต่อ</button>
              </div>
          `;

    // Show modal with animation
    mobileBackdrop.classList.add("open");
    mobileCard.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeMobileDetail() {
  const mobileBackdrop = document.getElementById("mobileModalBackdrop");
  const mobileCard = document.getElementById("mobileModalCard");
  if (mobileBackdrop && mobileCard) {
    mobileBackdrop.classList.remove("open");
    mobileCard.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ========================================
// Inbox Filters (Category + Status)
// ========================================
function toggleCategoryDropdown() {
  const menu = document.getElementById('categoryDropdownMenu');
  const arrow = document.getElementById('categoryArrow');
  menu.classList.toggle('hidden');
  arrow.classList.toggle('rotate-180');
  // Close status dropdown if open
  document.getElementById('statusDropdownMenu').classList.add('hidden');
  document.getElementById('statusArrow').classList.remove('rotate-180');
}

function selectCategory(category, label) {
  document.getElementById('categoryLabel').textContent = label;
  document.getElementById('categoryDropdownMenu').classList.add('hidden');
  document.getElementById('categoryArrow').classList.remove('rotate-180');

  // Update the list header label
  const headerLabel = document.getElementById('listHeaderLabel');
  if (headerLabel) {
    headerLabel.textContent = label;
  }

  // Filter message items
  const messages = document.querySelectorAll('.message-item');
  let visibleCount = 0;
  messages.forEach(msg => {
    if (category === 'all' || msg.dataset.category === category) {
      msg.style.display = '';
      visibleCount++;
    } else {
      msg.style.display = 'none';
    }
  });

  // Update count badge
  const countBadge = document.querySelector('#listHeaderLabel + span');
  if (countBadge) {
    countBadge.textContent = visibleCount;
  }
}

function toggleStatusDropdown() {
  const menu = document.getElementById('statusDropdownMenu');
  const arrow = document.getElementById('statusArrow');
  menu.classList.toggle('hidden');
  arrow.classList.toggle('rotate-180');
  // Close category dropdown if open
  document.getElementById('categoryDropdownMenu').classList.add('hidden');
  document.getElementById('categoryArrow').classList.remove('rotate-180');
}

function selectStatus(status, label) {
  document.getElementById('statusLabel').textContent = label;
  document.getElementById('statusDropdownMenu').classList.add('hidden');
  document.getElementById('statusArrow').classList.remove('rotate-180');

  // Filter message items by read/unread
  const messages = document.querySelectorAll('.message-item');
  messages.forEach(msg => {
    const hasUnreadDot = msg.querySelector('.bg-blue-500.rounded-full.w-2');
    if (status === 'all') {
      msg.dataset.statusHidden = 'false';
    } else if (status === 'unread') {
      msg.dataset.statusHidden = hasUnreadDot ? 'false' : 'true';
    }
  });
  applyFilters();
}

function applyFilters() {
  const messages = document.querySelectorAll('.message-item');
  let visibleCount = 0;
  messages.forEach(msg => {
    const statusHidden = msg.dataset.statusHidden === 'true';

    if (statusHidden) {
      msg.style.display = 'none';
    } else {
      // Re-check category filter
      const currentCategory = document.getElementById('categoryLabel').textContent;
      const categoryMap = { 'ทั้งหมด': 'all', 'ร้องเรียน': 'complaint', 'ชื่นชม': 'compliment', 'เสนอแนะ': 'suggestion' };
      const cat = categoryMap[currentCategory] || 'all';
      if (cat === 'all' || msg.dataset.category === cat) {
        msg.style.display = '';
        visibleCount++;
      } else {
        msg.style.display = 'none';
      }
    }
  });
  const countBadge = document.querySelector('#listHeaderLabel + span');
  if (countBadge) countBadge.textContent = visibleCount;
}

// ========================================
// Toolbar: Search, Notifications, Filter
// ========================================
function toggleSearch() {
  console.log("Search clicked");
  alert("ฟังก์ชันค้นหา - Coming soon!");
}

function toggleNotifications() {
  const dropdown = document.getElementById("notificationDropdown");
  dropdown.classList.toggle("open");
}

function markAllRead() {
  const badge = document.getElementById("notificationBadge");
  if (badge) badge.style.display = "none";
}

function toggleFilterDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  dropdown.classList.toggle("hidden");
}

function setFilter(filterType) {
  console.log("Filter set to:", filterType);
  document.getElementById("filterDropdown").classList.add("hidden");

  const filterNames = {
    all: "ข้อความทั้งหมด",
    unread: "ยังไม่ได้อ่าน",
    pinned: "ปักมุด",
    nostatus: "ยังไม่เลือกสถานะ",
  };
}

// ========================================
// Click-outside Handlers
// ========================================

// Category & Status dropdowns
document.addEventListener('click', function (e) {
  const catBtn = document.getElementById('categoryDropdownBtn');
  const catMenu = document.getElementById('categoryDropdownMenu');
  if (catBtn && catMenu && !catBtn.contains(e.target) && !catMenu.contains(e.target)) {
    catMenu.classList.add('hidden');
    document.getElementById('categoryArrow').classList.remove('rotate-180');
  }
  const statusBtn = document.getElementById('statusDropdownBtn');
  const statusMenu = document.getElementById('statusDropdownMenu');
  if (statusBtn && statusMenu && !statusBtn.contains(e.target) && !statusMenu.contains(e.target)) {
    statusMenu.classList.add('hidden');
    document.getElementById('statusArrow').classList.remove('rotate-180');
  }
});

// Notification & Filter dropdowns
document.addEventListener("click", function (e) {
  const notifDropdown = document.getElementById("notificationDropdown");
  const notifButton = e.target.closest(
    'button[onclick="toggleNotifications()"]',
  );

  if (!notifButton && !e.target.closest("#notificationDropdown")) {
    notifDropdown.classList.remove("open");
  }

  const filterDropdown = document.getElementById("filterDropdown");
  const filterButton = e.target.closest(
    'button[onclick="toggleFilterDropdown()"]',
  );

  if (!filterButton && !e.target.closest("#filterDropdown")) {
    filterDropdown.classList.add("hidden");
  }
});

// ========================================
// Panel Resizer
// ========================================
(function () {
  const resizer = document.getElementById('panelResizer');
  const leftPanel = document.getElementById('leftPanel');
  if (!resizer || !leftPanel) return;

  let isResizing = false;

  resizer.addEventListener('mousedown', function (e) {
    isResizing = true;
    resizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isResizing) return;
    const container = leftPanel.parentElement;
    const containerRect = container.getBoundingClientRect();
    let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    newWidth = Math.max(25, Math.min(65, newWidth));
    leftPanel.style.width = newWidth + '%';
  });

  document.addEventListener('mouseup', function () {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
})();

// ========================================
// DOM Init: Restructure message items
// ========================================
document.querySelectorAll('.message-item').forEach(item => {
  const headerRow = item.querySelector('.flex.items-center.justify-between.mb-1');
  if (!headerRow) return;

  const dateSpan = headerRow.querySelector(':scope > span.text-xs.text-gray-400');
  if (!dateSpan) return;

  const dateText = dateSpan.textContent.trim();

  // Replace date with action icons (unread toggle + pin)
  const msgId = item.getAttribute('onclick').match(/\d+/)[0];
  dateSpan.outerHTML = `<div class="flex items-center gap-1 shrink-0">
    <svg class="w-3.5 h-3.5 text-gray-300 cursor-pointer hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" onclick="event.stopPropagation(); toggleUnread(${msgId}, this)" title="อ่านแล้ว/ยังไม่อ่าน">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
    </svg>
    <svg class="w-3.5 h-3.5 text-gray-300 cursor-pointer hover:text-blue-500 transition-colors pin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" onclick="event.stopPropagation(); togglePin(${msgId}, this)" title="ปักมุด">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
    </svg>
  </div>`;

  // Add date next to the category badge
  const badgeSpan = headerRow.querySelector('.flex.items-center.gap-2 span[class*="rounded-full"]');
  if (badgeSpan) {
    const dateEl = document.createElement('span');
    dateEl.className = 'text-xs text-gray-400 ml-1';
    dateEl.textContent = dateText;
    badgeSpan.parentElement.appendChild(dateEl);
  }

  // Replace profile circle with dot indicator
  const outerFlex = item.querySelector('.flex.items-start.gap-3');
  if (!outerFlex) return;
  const profileCircle = outerFlex.querySelector(':scope > div:first-child:not(.flex-1)');
  const unreadDot = outerFlex.querySelector(':scope > .w-2.h-2.bg-blue-500');

  if (profileCircle) {
    const indicator = document.createElement('div');
    indicator.className = 'dot-indicator';
    if (unreadDot) {
      indicator.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>';
      unreadDot.remove();
    }
    profileCircle.replaceWith(indicator);
  } else if (unreadDot) {
    unreadDot.remove();
    const indicator = document.createElement('div');
    indicator.className = 'dot-indicator';
    indicator.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>';
    outerFlex.insertBefore(indicator, outerFlex.firstChild);
  }
});

// ========================================
// DOM Init: Date section dividers
// ========================================
(function () {
  const list = document.querySelector('.flex-1.overflow-y-auto.custom-scrollbar');
  if (!list) return;

  // Parse Thai Buddhist date (DD/MM/BBEE) to JS Date
  function parseBEDate(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]) - 543;
    return new Date(year, month, day);
  }

  // Determine section label for a date
  function getSectionLabel(dateStr) {
    const d = parseBEDate(dateStr);
    if (!d) return 'อื่นๆ';
    const today = new Date(2026, 1, 3); // 03/02/2569 = 2026-02-03
    const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'วันนี้';
    if (diffDays === 1) return 'เมื่อวานนี้';
    if (diffDays <= 6) return 'สัปดาห์นี้';
    if (diffDays <= 13) return 'สัปดาห์ก่อน';
    return 'เก่ากว่านั้น';
  }

  // Create pinned section header (hidden by default)
  const pinnedHeader = document.createElement('div');
  pinnedHeader.id = 'pinnedSectionHeader';
  pinnedHeader.className = 'date-section-header flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 cursor-pointer select-none';
  pinnedHeader.dataset.section = 'pinned';
  pinnedHeader.style.display = 'none';
  pinnedHeader.innerHTML = `
    <svg class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 section-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
    <svg class="w-3.5 h-3.5 text-blue-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
    </svg>
    <span class="text-xs font-semibold text-blue-600">ปักมุด</span>
  `;
  pinnedHeader.addEventListener('click', function () {
    const chevron = this.querySelector('.section-chevron');
    const isCollapsed = chevron.classList.contains('-rotate-90');
    chevron.classList.toggle('-rotate-90');
    let next = this.nextElementSibling;
    while (next && next.dataset.pinned === 'true') {
      next.style.display = isCollapsed ? '' : 'none';
      next = next.nextElementSibling;
    }
  });
  list.insertBefore(pinnedHeader, list.firstElementChild);

  // Collect dates from the date elements we moved to bottom row
  const items = list.querySelectorAll('.message-item');
  let lastSection = '';

  items.forEach(item => {
    const dateEl = item.querySelector('.text-\\[10px\\].text-gray-400');
    if (!dateEl) return;
    const dateStr = dateEl.textContent.trim();
    const section = getSectionLabel(dateStr);
    item.dataset.dateSection = section;

    if (section !== lastSection) {
      const header = document.createElement('div');
      header.className = 'date-section-header flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 cursor-pointer select-none';
      header.dataset.section = section;
      header.innerHTML = `
        <svg class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 section-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
        <span class="text-xs font-semibold text-amber-600">${section}</span>
      `;
      header.addEventListener('click', function () {
        const chevron = this.querySelector('.section-chevron');
        const isCollapsed = chevron.classList.contains('-rotate-90');
        chevron.classList.toggle('-rotate-90');
        let next = this.nextElementSibling;
        while (next && !next.classList.contains('date-section-header')) {
          next.style.display = isCollapsed ? '' : 'none';
          next = next.nextElementSibling;
        }
      });
      list.insertBefore(header, item);
      lastSection = section;
    }
  });
})();
