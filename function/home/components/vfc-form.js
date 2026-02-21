/**
 * VFC Form Shared Component
 * Shared functions for complaint.html, compliment.html, suggestion.html
 * 
 * Usage:
 *   <script src="../../function/user/components/vfc-form.js"></script>
 *   <script>
 *     VFCForm.init({ detailPrefix: 'complaint' });
 *   </script>
 */

const VFCForm = (function () {
    'use strict';

    // ========================================
    // Organization Data (from Supabase)
    // ========================================

    // Cache to avoid repeated API calls
    let _stationsCache = null;
    let _departmentsCache = null;
    let _sectionsCache = null;

    const sb = () => window.supabaseClient;

    /**
     * Fetch all stations from Supabase
     */
    async function fetchStations() {
        if (_stationsCache) return _stationsCache;
        const { data, error } = await sb()
            .from('stations')
            .select('value, label')
            .order('sort_order');
        if (error) { console.error('fetchStations error:', error); return []; }
        _stationsCache = data || [];
        return _stationsCache;
    }

    /**
     * Fetch all departments from Supabase
     */
    async function fetchAllDepartments() {
        if (_departmentsCache) return _departmentsCache;
        const { data, error } = await sb()
            .from('departments')
            .select('station_type, value, label')
            .order('sort_order');
        if (error) { console.error('fetchDepartments error:', error); return []; }
        _departmentsCache = data || [];
        return _departmentsCache;
    }

    /**
     * Fetch all sections from Supabase
     */
    async function fetchAllSections() {
        if (_sectionsCache) return _sectionsCache;
        const { data, error } = await sb()
            .from('sections')
            .select('station_value, department_value, value, label')
            .order('sort_order');
        if (error) { console.error('fetchSections error:', error); return []; }
        _sectionsCache = data || [];
        return _sectionsCache;
    }

    /**
     * Get departments based on selected station
     */
    async function getDepartments(station) {
        const allDepts = await fetchAllDepartments();
        const type = (station === 'สำนักงานใหญ่ (HDQ)') ? 'HDQ' : 'STATION';
        const filtered = allDepts.filter(d => d.station_type === type);
        return [
            { value: '', label: 'เลือกฝ่าย', placeholder: true, disabled: true },
            ...filtered
        ];
    }

    /**
     * Get sections based on selected station + department
     */
    async function getSections(station, department) {
        const allSections = await fetchAllSections();
        let filtered;

        if (station === 'สำนักงานใหญ่ (HDQ)') {
            filtered = allSections.filter(s => s.station_value === 'สำนักงานใหญ่ (HDQ)' && s.department_value === department);
        } else if (station === 'สถานีสุวรรณภูมิ (BKK)' && department === 'BG') {
            filtered = allSections.filter(s => s.station_value === 'สถานีสุวรรณภูมิ (BKK)' && s.department_value === 'BG');
        } else if (station && department === 'BG') {
            // Other stations + BG
            filtered = allSections.filter(s => s.station_value === 'OTHER' && s.department_value === 'BG');
        } else if (station && department) {
            // Fix #4: generic fallback — try exact match by station_value + department_value
            // to support any future stations added to Supabase without code changes
            filtered = allSections.filter(s => s.station_value === station && s.department_value === department);
            if (filtered.length === 0) {
                // Try matching just by department_value as a last resort
                filtered = allSections.filter(s => s.station_value === 'OTHER' && s.department_value === department);
            }
        } else {
            filtered = [];
        }

        if (filtered.length === 0) {
            return [{ value: '', label: 'เลือกแผนก', placeholder: true, disabled: true }];
        }

        return [
            { value: '', label: 'เลือกแผนก', placeholder: true, disabled: true },
            { value: '-', label: '-' },
            ...filtered
        ];
    }

    /**
     * Populate a station <select> with data from Supabase
     */
    async function populateStationSelect(selectId) {
        const el = document.getElementById(selectId);
        if (!el) return;
        const stations = await fetchStations();
        // Keep placeholder option, add stations
        el.innerHTML = '<option value="">เลือกสถานี</option>';
        stations.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.value;
            opt.textContent = s.label;
            el.appendChild(opt);
        });
    }

    // ========================================
    // Shared Choices.js Config
    // ========================================

    const CHOICES_CONFIG = {
        searchEnabled: true,
        searchPlaceholderValue: 'พิมพ์เพื่อค้นหา...',
        noResultsText: 'ไม่พบผลลัพธ์',
        noChoicesText: 'ไม่มีตัวเลือก',
        itemSelectText: '',
        shouldSort: false,
        searchFloor: 1,
        searchResultLimit: 100
    };

    // ========================================
    // Core Logic Functions
    // ========================================

    /**
     * Create a dropdown group handler (station -> department -> section cascade)
     */
    function createDropdownGroup(stationId, departmentId, sectionId) {
        let stationChoices, departmentChoices, sectionChoices;

        async function updateDept() {
            const station = document.getElementById(stationId).value;
            const departments = await getDepartments(station);
            if (departmentChoices) {
                departmentChoices.clearStore();
                departmentChoices.setChoices(departments, 'value', 'label', true);
            }
            await updateSec();
        }

        async function updateSec() {
            const station = document.getElementById(stationId).value;
            const department = document.getElementById(departmentId).value;
            const sections = await getSections(station, department);
            if (sectionChoices) {
                sectionChoices.clearStore();
                sectionChoices.setChoices(sections, 'value', 'label', true);
            }
        }

        // Initialize Choices.js
        async function initChoices() {
            // Populate station options from Supabase first
            await populateStationSelect(stationId);

            if (document.getElementById(stationId)) {
                stationChoices = new Choices('#' + stationId, CHOICES_CONFIG);
                document.getElementById(stationId).addEventListener('change', updateDept);
            }
            if (document.getElementById(departmentId)) {
                departmentChoices = new Choices('#' + departmentId, CHOICES_CONFIG);
                document.getElementById(departmentId).addEventListener('change', updateSec);
            }
            if (document.getElementById(sectionId)) {
                sectionChoices = new Choices('#' + sectionId, CHOICES_CONFIG);
            }
        }

        return { initChoices, updateDept, updateSec };
    }

    // ========================================
    // UI Functions
    // ========================================

    /**
     * Toggle identity fields visibility
     */
    function toggleIdentityFields() {
        const toggle = document.getElementById('identityToggle');
        const fields = document.getElementById('identityFields');
        const divider = document.getElementById('identityDivider');
        const label = document.getElementById('identityLabel');

        if (toggle.checked) {
            label.textContent = 'ระบุตัวตน';
            label.className = 'text-sm text-gray-900 font-medium';

            fields.style.visibility = 'visible';
            fields.style.pointerEvents = 'auto';
            fields.style.maxHeight = fields.scrollHeight + 'px';
            fields.style.opacity = '1';
            fields.style.marginTop = '0';
            divider.style.opacity = '1';
            divider.style.maxHeight = '1px';
            divider.style.marginBottom = '16px';
            setTimeout(() => { fields.style.maxHeight = 'none'; }, 300);
        } else {
            label.textContent = 'ไม่ระบุตัวตน';
            label.className = 'text-sm text-gray-600';

            fields.style.maxHeight = fields.scrollHeight + 'px';
            divider.style.opacity = '0';
            divider.style.maxHeight = '0';
            divider.style.marginBottom = '0';
            setTimeout(() => {
                fields.style.maxHeight = '0';
                fields.style.opacity = '0';
                fields.style.marginTop = '-16px';
                fields.style.pointerEvents = 'none';
                fields.style.visibility = 'hidden';
            }, 10);
        }
    }

    /**
     * Category pill selection
     */
    function selectCategory(btn, value) {
        const activeClasses = ['bg-gray-900', 'text-white', 'border-gray-900'];
        const inactiveClasses = ['bg-white', 'text-gray-600', 'border-gray-200'];

        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.classList.remove(...activeClasses);
            pill.classList.add(...inactiveClasses);
        });
        btn.classList.remove(...inactiveClasses);
        btn.classList.add(...activeClasses);
        document.getElementById('selectedCategory').value = value;

        const otherContainer = document.getElementById('otherCategoryContainer');
        const otherInput = document.getElementById('otherCategoryInput');
        if (value === 'other') {
            otherContainer.classList.remove('hidden');
            otherInput.focus();
        } else {
            otherContainer.classList.add('hidden');
            otherInput.value = '';
        }
    }

    /**
     * Add file upload item
     */
    function addFileItem() {
        const container = document.getElementById('fileListContainer');
        const newItem = document.createElement('div');
        newItem.className = 'file-item p-4 bg-gray-50 rounded-3xl border border-gray-200';
        newItem.innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <label class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition-colors shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    <input type="file" accept="image/*,.pdf,.doc,.docx" class="hidden" onchange="VFCForm.updateFileName(this)">
                </label>
                <input type="text" placeholder="กรุณาตั้งชื่อไฟล์" 
                    class="flex-1 px-4 py-2 rounded-3xl border border-gray-200 outline-none transition-all text-sm min-w-0">
                <button type="button" onclick="this.closest('.file-item').remove()" 
                    class="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <span class="file-name text-xs text-red-500 pl-1">ยังไม่ได้เลือกไฟล์</span>
        `;
        container.appendChild(newItem);
    }

    /**
     * Update file name display
     */
    function updateFileName(input) {
        const span = input.closest('.file-item').querySelector('.file-name');
        if (input.files[0]) {
            span.textContent = input.files[0].name;
            span.className = 'file-name text-xs text-blue-500 underline pl-1';
        } else {
            span.textContent = 'ยังไม่ได้เลือกไฟล์';
            span.className = 'file-name text-xs text-red-500 pl-1';
        }
    }

    // ========================================
    // Tracking Modal
    // ========================================

    function generateTrackingNumber(prefix) {
        // Random 8-char alphanumeric code (unguessable)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const arr = new Uint8Array(8);
        crypto.getRandomValues(arr);
        const code = Array.from(arr, b => chars[b % chars.length]).join('');
        return `VFC-${code}`;
    }

    function createTrackingModal() {
        const modal = document.createElement('div');
        modal.id = 'trackingModal';
        modal.className = 'fixed inset-0 z-[999] flex items-center justify-center p-4 hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeTrackingModal()"></div>
            <div class="relative bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center z-10">
                <!-- X Close Button -->
                <button onclick="closeTrackingModal()" 
                    class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">ส่งเรื่องสำเร็จ!</h3>
                <p class="text-sm text-gray-500 mb-4">กรุณาบันทึกหมายเลขติดตามของคุณ</p>
                <!-- Saveable area -->
                <div id="trackingSaveArea">
                    <div class="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-200">
                        <p class="text-xs text-gray-400 mb-1">หมายเลขติดตาม</p>
                        <p id="trackingNumber" class="text-lg font-bold text-gray-900 tracking-wider select-all"></p>
                    </div>
                    <div class="flex justify-center mb-5">
                        <div class="bg-white p-3 rounded-2xl border border-gray-200 inline-block">
                            <img id="trackingQR" src="" alt="QR Code" class="w-40 h-40" crossorigin="anonymous" />
                        </div>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mb-4">สแกน QR Code เพื่อบันทึกหมายเลขติดตาม</p>
                <!-- Save Button -->
                <button onclick="saveTrackingImage()" 
                    class="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <span>บันทึกลงเครื่อง</span>
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showTrackingModal(trackingNum) {
        document.getElementById('trackingNumber').textContent = trackingNum;
        document.getElementById('trackingQR').src =
            'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(trackingNum);
        document.getElementById('trackingModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeTrackingModal() {
        document.getElementById('trackingModal').classList.add('hidden');
        document.body.style.overflow = '';
        window.location.href = 'vfc.html';
    }

    function saveTrackingImage() {
        const trackingNum = document.getElementById('trackingNumber').textContent;
        const qrImg = document.getElementById('trackingQR');

        // Create canvas to combine QR + tracking number
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 40;
        const qrSize = 200;
        const textHeight = 60;
        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2 + textHeight;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw tracking number text
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('หมายเลขติดตาม', canvas.width / 2, padding);
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText(trackingNum, canvas.width / 2, padding + 30);

        // Draw QR code
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            ctx.drawImage(img, padding, padding + textHeight, qrSize, qrSize);
            // Download
            const link = document.createElement('a');
            link.download = trackingNum + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.onerror = function () {
            // Fallback: download just the text as image
            const link = document.createElement('a');
            link.download = trackingNum + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = qrImg.src;
    }

    // ========================================
    // Initialization
    // ========================================

    /**
     * Initialize VFC Form
     * @param {Object} options
     * @param {string} options.detailPrefix - 'complaint' | 'compliment' | 'suggestion'
     */
    function init(options = {}) {
        const prefix = options.detailPrefix || 'suggestion';

        document.addEventListener('DOMContentLoaded', async function () {
            // Personal Info dropdown group
            const personalGroup = createDropdownGroup('stationSelect', 'departmentSelect', 'sectionSelect');
            await personalGroup.initChoices();

            // Make personal group functions accessible for inline onchange
            window.updateDepartmentOptions = personalGroup.updateDept;
            window.updateSectionOptions = personalGroup.updateSec;

            // Detail section dropdown group (complaint/compliment/suggestion)
            const detailStationId = prefix + 'StationSelect';
            const detailDeptId = prefix + 'DepartmentSelect';
            const detailSectionId = prefix + 'SectionSelect';

            if (document.getElementById(detailStationId)) {
                const detailGroup = createDropdownGroup(detailStationId, detailDeptId, detailSectionId);
                await detailGroup.initChoices();

                // Make detail group functions accessible  
                const capPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                window['update' + capPrefix + 'DepartmentOptions'] = detailGroup.updateDept;
                window['update' + capPrefix + 'SectionOptions'] = detailGroup.updateSec;
            }

            // Initialize identity fields transitions
            const fields = document.getElementById('identityFields');
            const divider = document.getElementById('identityDivider');
            if (fields) {
                fields.style.transition = 'max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease';
                fields.style.overflow = 'hidden';
            }
            if (divider) {
                divider.style.transition = 'max-height 0.3s ease, opacity 0.3s ease, margin-bottom 0.3s ease';
            }

            // Create tracking modal
            createTrackingModal();

            // Form submit handler
            // Fix #2: use #vfcForm by id (explicit), with generic querySelector as fallback
            const form = document.getElementById('vfcForm') || document.querySelector('form');
            if (form) {
                form.addEventListener('submit', async function (e) {
                    e.preventDefault();

                    // Collect data
                    const isAnonymous = !document.getElementById('identityToggle')?.checked;
                    const trackingNum = generateTrackingNumber(prefix);

                    const getValue = (id) => {
                        const el = document.getElementById(id);
                        return el ? (el.value || '').trim() : '';
                    };

                    const getSelectText = (id) => {
                        const el = document.getElementById(id);
                        if (!el || el.selectedIndex <= 0) return '';
                        return el.options[el.selectedIndex].text;
                    };

                    // Detail dropdown IDs
                    const capPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                    const detailStationId = prefix + 'StationSelect';
                    const detailDeptId = prefix + 'DepartmentSelect';
                    const detailSectionId = prefix + 'SectionSelect';

                    const category = getValue('selectedCategory');
                    const otherCategory = getValue('otherCategoryInput');

                    const data = {
                        tracking_number: trackingNum,
                        type: prefix,
                        subject: getValue('subjectInput'),
                        category: category === 'other' ? otherCategory : category,
                        is_anonymous: isAnonymous,
                        reporter_name: isAnonymous ? null : (getValue('firstName') + ' ' + getValue('lastName')).trim() || null,
                        reporter_employee_id: isAnonymous ? null : getValue('employeeId') || null,
                        reporter_station: isAnonymous ? null : getSelectText('stationSelect') || null,
                        reporter_department: isAnonymous ? null : getSelectText('departmentSelect') || null,
                        reporter_section: isAnonymous ? null : getSelectText('sectionSelect') || null,
                        detail_station: getSelectText(detailStationId) || null,
                        detail_department: getSelectText(detailDeptId) || null,
                        detail_section: getSelectText(detailSectionId) || null,
                        detail_text: getValue('detailText') || null,
                        fix_text: getValue('fixText') || null,
                        status: 'pending'
                    };

                    // Submit to Supabase
                    try {
                        if (!window.supabaseClient) {
                            alert('Supabase ยังไม่พร้อม กรุณารีเฟรชหน้า');
                            return;
                        }

                        const { error } = await window.supabaseClient
                            .from('vfc_submissions')
                            .insert([data]);

                        if (error) {
                            console.error('Supabase error:', error);
                            alert('เกิดข้อผิดพลาด: ' + error.message + '\n\nCode: ' + (error.code || 'N/A'));
                            return;
                        }

                        showTrackingModal(trackingNum);
                    } catch (err) {
                        console.error('Submit error:', err);
                        alert('ไม่สามารถส่งข้อมูลได้: ' + err.message);
                    }
                });
            }
        });
    }

    // ========================================
    // Public API
    // ========================================

    return {
        init,
        toggleIdentityFields,
        selectCategory,
        addFileItem,
        updateFileName,
        closeTrackingModal,
        saveTrackingImage
    };

})();

// Expose functions globally for inline event handlers
window.toggleIdentityFields = VFCForm.toggleIdentityFields;
window.selectCategory = VFCForm.selectCategory;
window.addFileItem = VFCForm.addFileItem;
window.updateFileName = VFCForm.updateFileName;
window.closeTrackingModal = VFCForm.closeTrackingModal;
window.saveTrackingImage = VFCForm.saveTrackingImage;
