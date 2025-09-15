class EduCRM {
    constructor() {
        this.currentSection = 'dashboard';
        this.navigationHistory = ['dashboard']; // Initialize navigation history
        this.currentStudentId = null;
        this.currentGroupId = null;
        this.currentJournalGroupId = null;
        this.currentJournalMonth = new Date(); // Initialize with current date
        this.currentJournalView = 'month'; // 'month' or 'week'
        this.currentJournalWeek = 0; // Index of the current week in the month (0-indexed)
        this.currentCommentContext = { groupId: null, date: null, studentId: null }; // New property for comment modal
        this.students = [];
        this.groups = [];
        this.journal = {}; // Structure: { groupId: { 'YYYY-MM-DD': { studentId: { attendance: true, grade: 5, comment: '' } } } }
        this.monthlyAssessments = {}; // Structure: { groupId: { 'YYYY-MM': { studentId: { examScore: 0, bonusPoints: 0, finalGrade: 0 } } } }
        this.settings = {
            institutionName: 'Учебный центр',
            academicYear: '2024-2025',
            maxGrade: 5,
            bonusSystem: 'enabled'
        };
        
        this.init();
    }

    async init() {
        await this.initDB();
        await this.loadData();
        this.initEventListeners();
        this.renderCurrentSection();
        this.updateStats();
        this.applyTheme(); // Apply theme on initialization
        lucide.createIcons();
    }

    // IndexedDB functions
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EduCRM', 2); // Increment database version
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create stores
                if (!db.objectStoreNames.contains('students')) {
                    const studentsStore = db.createObjectStore('students', { keyPath: 'id' });
                    studentsStore.createIndex('status', 'status', { unique: false });
                    studentsStore.createIndex('group', 'group', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('groups')) {
                    db.createObjectStore('groups', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('journal')) {
                    db.createObjectStore('journal', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('monthlyAssessments')) {
                    db.createObjectStore('monthlyAssessments', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                console.log('IndexedDB upgrade needed: All object stores checked/created.');
            };
        });
    }

    async saveToDB(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return store.put(data);
    }

    async getFromDB(storeName, key = null) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        if (key) {
            return new Promise((resolve) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
            });
        } else {
            return new Promise((resolve) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
            });
        }
    }

    async deleteFromDB(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return store.delete(key);
    }

    // Data management
    async loadData() {
        // Load students
        this.students = await this.getFromDB('students') || [];
        
        // Load groups
        this.groups = await this.getFromDB('groups') || [];
        
        // Load journal
        const journalEntries = await this.getFromDB('journal') || [];
        this.journal = {};
        journalEntries.forEach(entry => {
            if (!this.journal[entry.groupId]) {
                this.journal[entry.groupId] = {};
            }
            this.journal[entry.groupId][entry.date] = entry.data; // Store daily data directly
        });

        // Load monthly assessments
        const monthlyAssessmentEntries = await this.getFromDB('monthlyAssessments') || [];
        this.monthlyAssessments = {};
        monthlyAssessmentEntries.forEach(entry => {
            if (!this.monthlyAssessments[entry.groupId]) {
                this.monthlyAssessments[entry.groupId] = {};
            }
            if (!this.monthlyAssessments[entry.groupId][entry.monthYear]) {
                this.monthlyAssessments[entry.groupId][entry.monthYear] = {};
            }
            this.monthlyAssessments[entry.groupId][entry.monthYear][entry.studentId] = entry.data;
        });
        
        // Load settings
        const settingsData = await this.getFromDB('settings') || [];
        settingsData.forEach(setting => {
            this.settings[setting.key] = setting.value;
        });
        
        // Load demo data if empty
        if (this.students.length === 0) {
            await this.loadDemoData();
        }
    }

    async loadDemoData() {
        // Demo groups
        const demoGroups = [
            {
                id: '1',
                name: 'Группа А-101',
                description: 'Базовый курс программирования',
                color: '#2563eb',
                schedule: {
                    monday: '09:00',
                    wednesday: '09:00',
                    friday: '09:00'
                }
            },
            {
                id: '2',
                name: 'Группа Б-202',
                description: 'Продвинутый курс веб-разработки',
                color: '#10b981',
                schedule: {
                    tuesday: '14:00',
                    thursday: '14:00'
                }
            }
        ];

        // Demo students
        const demoStudents = [
            {
                id: '1',
                name: 'Иван',
                surname: 'Петров',
                email: 'ivan@example.com',
                phone: '+7 999 123-45-67',
                group: '1',
                status: 'active'
            },
            {
                id: '2',
                name: 'Мария',
                surname: 'Сидорова',
                email: 'maria@example.com',
                phone: '+7 999 234-56-78',
                group: '1',
                status: 'active'
            },
            {
                id: '3',
                name: 'Алексей',
                surname: 'Козлов',
                email: 'alexey@example.com',
                phone: '+7 999 345-67-89',
                group: '2',
                status: 'active'
            }
        ];

        // Save demo data
        for (const group of demoGroups) {
            await this.saveToDB('groups', group);
            this.groups.push(group);
        }

        for (const student of demoStudents) {
            await this.saveToDB('students', student);
            this.students.push(student);
        }
    }

    // Event listeners
    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Back button
        document.querySelector('.back-button').addEventListener('click', () => this.goBack());

        // Students
        document.getElementById('add-student-btn').addEventListener('click', () => this.openStudentModal());
        document.getElementById('student-search').addEventListener('input', (e) => this.filterStudents(e.target.value));
        document.getElementById('student-filter').addEventListener('change', (e) => this.filterStudentsByStatus(e.target.value));
        document.getElementById('student-form').addEventListener('submit', (e) => this.saveStudent(e));

        // Groups
        document.getElementById('add-group-btn').addEventListener('click', () => this.openGroupModal());
        document.getElementById('group-form').addEventListener('submit', (e) => this.saveGroup(e));

        // Journal
        document.getElementById('group-select').addEventListener('change', (e) => this.loadJournal(e.target.value, this.currentJournalMonth));
        document.getElementById('prev-month-btn').addEventListener('click', () => this.prevMonth());
        document.getElementById('next-month-btn').addEventListener('click', () => this.nextMonth());
        document.getElementById('prev-week-btn').addEventListener('click', () => this.prevWeek());
        document.getElementById('next-week-btn').addEventListener('click', () => this.nextWeek());
        document.getElementById('toggle-view-btn').addEventListener('click', () => this.toggleJournalView());

        // Settings
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());

        // Comment modal
        document.getElementById('comment-form').addEventListener('submit', (e) => this.saveComment(e));

        // Modals
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        });

        // Schedule checkboxes
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
            const checkbox = document.getElementById(day);
            const timeInput = document.getElementById(`${day}-time`);
            if (checkbox && timeInput) {
                checkbox.addEventListener('change', () => {
                    timeInput.disabled = !checkbox.checked;
                    if (!checkbox.checked) timeInput.value = '';
                });
            }
        });

        // Reports
        document.querySelectorAll('[data-report]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportType = e.currentTarget.dataset.report;
                this.openReportOptionsModal(reportType);
            });
        });

        // Report options modal
        document.getElementById('report-group-select').addEventListener('change', (e) => this.populateReportStudentSelect(e.target.value));
        document.getElementById('report-options-form').addEventListener('submit', (e) => this.handleReportOptionsSubmit(e));

        // Mobile menu toggle
        this.addMobileMenuToggle();

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('change', () => this.toggleTheme());
    }

    addMobileMenuToggle() {
        const header = document.querySelector('.header');
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        menuToggle.style.display = 'none';
        
        header.insertBefore(menuToggle, header.firstChild);
        
        menuToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('mobile-open');
        });
        
        // Show/hide mobile menu toggle
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            } else {
                menuToggle.style.display = 'none';
                document.querySelector('.sidebar').classList.remove('mobile-open');
            }
        };
        
        window.addEventListener('resize', checkMobile);
        checkMobile();
    }

    // Section switching
    switchSection(sectionName, pushToHistory = true) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        // Manage navigation history
        if (pushToHistory && this.navigationHistory[this.navigationHistory.length - 1] !== sectionName) {
            this.navigationHistory.push(sectionName);
        }
        this.updateBackButtonVisibility(); // Update visibility after history change

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionName);
        });

        // Update header
        const titles = {
            dashboard: ['Дашборд', 'Обзор системы управления обучением'],
            students: ['Студенты', 'Управление студентами'],
            groups: ['Группы', 'Управление группами'],
            journal: ['Журнал', 'Журнал посещаемости и оценок'],
            reports: ['Отчеты', 'Генерация отчетов'],
            settings: ['Настройки', 'Настройки системы'],
            'student-analytics': ['Аналитика студента', 'Детальный обзор успеваемости'] // Add title for student analytics
        };

        const [title, subtitle] = titles[sectionName] || ['Неизвестно', '']; // Handle unknown sections
        document.getElementById('page-title').textContent = title;
        document.getElementById('page-subtitle').textContent = subtitle;

        this.currentSection = sectionName;
        this.renderCurrentSection();

        // Close mobile menu
        document.querySelector('.sidebar').classList.remove('mobile-open');
    }

    renderCurrentSection() {
        switch (this.currentSection) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'groups':
                this.renderGroups();
                break;
            case 'journal':
                this.renderJournal();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'settings':
                this.renderSettings();
                break;
            case 'student-analytics':
                // Handled by showStudentAnalytics, no direct render here
                break;
        }
        // Hide back button if on dashboard
        if (this.currentSection === 'dashboard') {
            document.querySelector('.back-button').style.display = 'none';
            this.navigationHistory = ['dashboard']; // Reset history for dashboard
        }
    }

    // Dashboard
    renderDashboard() {
        this.updateStats();
        this.renderWeeklyChart();
        this.renderRecentActivities();
    }

    updateStats() {
        const totalStudents = this.students.filter(s => s.status === 'active').length;
        const activeGroups = this.groups.length;
        const attendanceRate = this.calculateAverageAttendance();
        const averageGrade = this.calculateAverageGrade();

        this.animateNumber('total-students', totalStudents);
        this.animateNumber('active-groups', activeGroups);
        this.animateNumber('attendance-rate', attendanceRate, '%');
        this.animateNumber('average-grade', averageGrade.toFixed(1));
    }

    animateNumber(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.textContent) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 30);
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = current + suffix;
        }, 50);
    }

    calculateAverageAttendance() {
        let totalAttendance = 0;
        let totalPossibleSessions = 0; // Total sessions based on actual journal entries

        for (const groupId in this.journal) {
            const group = this.groups.find(g => g.id === groupId);
            if (!group || !group.schedule) continue;

            for (const dateKey in this.journal[groupId]) {
                const entryDate = new Date(dateKey);
                const dayOfWeek = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];

                if (group.schedule[dayName]) { // Only count if a lesson was scheduled for that day
                    for (const studentId in this.journal[groupId][dateKey]) {
                        const dayData = this.journal[groupId][dateKey][studentId];
                        if (dayData.attendance !== undefined) {
                            totalPossibleSessions++;
                            if (dayData.attendance) totalAttendance++;
                        }
                    }
                }
            }
        }

        return totalPossibleSessions > 0 ? Math.round((totalAttendance / totalPossibleSessions) * 100) : 85;
    }

    calculateAverageGrade() {
        let totalGrades = 0;
        let gradeCount = 0;

        for (const groupId in this.journal) {
            for (const dateKey in this.journal[groupId]) {
                for (const studentId in this.journal[groupId][dateKey]) {
                    const dayData = this.journal[groupId][dateKey][studentId];
                    if (dayData.grade && dayData.grade > 0) {
                        totalGrades += dayData.grade;
                        gradeCount++;
                    }
                }
            }
        }

        return gradeCount > 0 ? totalGrades / gradeCount : 4.2;
    }

    renderWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const data = {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Активность',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4
            }]
        };

        // Destroy existing chart if it exists
        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false, /* Added to prevent infinite scroll */
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderRecentActivities() {
        const activities = [
            {
                icon: 'user-plus',
                iconClass: 'blue',
                text: 'Добавлен новый студент Иван Петров',
                time: '2 часа назад'
            },
            {
                icon: 'clipboard-check',
                iconClass: 'green',
                text: 'Обновлен журнал для группы А-101',
                time: '4 часа назад'
            },
            {
                icon: 'users',
                iconClass: 'orange',
                text: 'Создана новая группа Б-202',
                time: '1 день назад'
            },
            {
                icon: 'award',
                iconClass: 'purple',
                text: 'Выставлены оценки за контрольную работу',
                time: '2 дня назад'
            },
            {
                icon: 'calendar',
                iconClass: 'blue',
                text: 'Обновлено расписание занятий',
                time: '3 дня назад'
            }
        ];

        const container = document.getElementById('recent-activities');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.iconClass}">
                    <i data-lucide="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span>${activity.time}</span>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    // Students
    renderStudents() {
        this.populateGroupSelect();
        this.displayStudents(this.students);
    }

    populateGroupSelect() {
        const select = document.getElementById('student-group');
        if (!select) return;

        select.innerHTML = '<option value="">Выберите группу</option>' +
            this.groups.map(group => `<option value="${group.id}">${group.name}</option>`).join('');
    }

    displayStudents(students) {
        const grid = document.getElementById('students-grid');
        if (!grid) return;

        grid.innerHTML = students.map(student => {
            const group = this.groups.find(g => g.id === student.group);
            const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
            const avatarColor = student.avatarColor || this.getRandomColor(); // Use existing color or generate new
            // Store the generated color if it's new, so it persists across renders
            if (!student.avatarColor) {
                student.avatarColor = avatarColor;
                this.saveToDB('students', student); // Persist the color
            }

            return `
                <div class="student-card animate-fade-in">
                    <div class="student-header">
                        <div class="student-avatar" style="background: ${avatarColor}; color: white;">${initials}</div>
                        <div class="student-actions">
                            <button class="action-btn edit" onclick="app.editStudent('${student.id}')">
                                <i data-lucide="edit"></i>
                            </button>
                            <button class="action-btn archive" onclick="app.toggleStudentStatus('${student.id}')">
                                <i data-lucide="archive"></i>
                            </button>
                        </div>
                    </div>
                    <div class="student-name" onclick="app.showStudentAnalytics('${student.id}')">${student.name} ${student.surname}</div>
                    <div class="student-group">${group ? group.name : 'Без группы'}</div>
                    <div class="student-contact">
                        ${student.email ? `
                            <div class="contact-item">
                                <i data-lucide="mail"></i>
                                <span>${student.email}</span>
                            </div>
                        ` : ''}
                        ${student.phone ? `
                            <div class="contact-item">
                                <i data-lucide="phone"></i>
                                <span>${student.phone}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="student-status status-${student.status}">
                        ${student.status === 'active' ? 'Активный' : 'Архив'}
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    filterStudents(searchTerm) {
        const filtered = this.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.displayStudents(filtered);
    }

    filterStudentsByStatus(status) {
        const filtered = status === 'all' ? this.students : this.students.filter(s => s.status === status);
        this.displayStudents(filtered);
    }

    openStudentModal(studentId = null) {
        this.currentStudentId = studentId;
        const modal = document.getElementById('student-modal');
        const title = document.getElementById('student-modal-title');
        const form = document.getElementById('student-form');

        if (studentId) {
            const student = this.students.find(s => s.id === studentId);
            title.textContent = 'Редактировать студента';
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-surname').value = student.surname;
            document.getElementById('student-email').value = student.email || '';
            document.getElementById('student-phone').value = student.phone || '';
            document.getElementById('student-group').value = student.group || '';
            document.getElementById('student-status').value = student.status;
        } else {
            title.textContent = 'Добавить студента';
            form.reset();
        }

        this.showModal(modal);
    }

    async saveStudent(e) {
        e.preventDefault();
        
        const studentData = {
            id: this.currentStudentId || Date.now().toString(),
            name: document.getElementById('student-name').value,
            surname: document.getElementById('student-surname').value,
            email: document.getElementById('student-email').value,
            phone: document.getElementById('student-phone').value,
            group: document.getElementById('student-group').value,
            status: document.getElementById('student-status').value
        };

        if (this.currentStudentId) {
            const index = this.students.findIndex(s => s.id === this.currentStudentId);
            this.students[index] = studentData;
        } else {
            this.students.push(studentData);
        }

        await this.saveToDB('students', studentData);
        this.renderStudents();
        this.updateStats();
        this.closeModal();
        this.currentStudentId = null;
    }

    editStudent(id) {
        this.openStudentModal(id);
    }

    async toggleStudentStatus(id) {
        const student = this.students.find(s => s.id === id);
        student.status = student.status === 'active' ? 'archived' : 'active';
        
        await this.saveToDB('students', student);
        this.renderStudents();
        this.updateStats();
    }

    // Groups
    renderGroups() {
        this.displayGroups();
        this.populateJournalGroupSelect();
    }

    displayGroups() {
        const grid = document.getElementById('groups-grid');
        if (!grid) return;

        grid.innerHTML = this.groups.map(group => {
            const studentsCount = this.students.filter(s => s.group === group.id && s.status === 'active').length;
            const scheduleText = this.formatSchedule(group.schedule);
            
            return `
                <div class="group-card animate-fade-in">
                    <div class="group-header">
                        <div class="group-info">
                            <div class="group-color" style="background: ${group.color}"></div>
                            <div class="group-details">
                                <h3>${group.name}</h3>
                                <div class="group-schedule">${scheduleText}</div>
                            </div>
                        </div>
                        <button class="action-btn edit" onclick="app.editGroup('${group.id}')">
                            <i data-lucide="edit"></i>
                        </button>
                    </div>
                    <div class="group-stats">
                        <div class="stat-item">
                            <div class="value">${studentsCount}</div>
                            <div class="label">Студентов</div>
                        </div>
                        <div class="stat-item">
                            <div class="value">92%</div>
                            <div class="label">Посещаемость</div>
                        </div>
                    </div>
                    <div class="group-actions">
                        <button class="btn btn-secondary btn-small" onclick="app.openJournalForGroup('${group.id}')">
                            Журнал
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.showGroupStudents('${group.id}')">
                            Студенты
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    formatSchedule(schedule) {
        const days = {
            monday: 'Пн',
            tuesday: 'Вт',
            wednesday: 'Ср',
            thursday: 'Чт',
            friday: 'Пт',
            saturday: 'Сб',
            sunday: 'Вс'
        };

        const activeDays = Object.keys(schedule).filter(day => schedule[day]);
        return activeDays.map(day => `${days[day]} ${schedule[day]}`).join(', ') || 'Расписание не задано';
    }

    openGroupModal(groupId = null) {
        this.currentGroupId = groupId;
        const modal = document.getElementById('group-modal');
        const title = document.getElementById('group-modal-title');
        const form = document.getElementById('group-form');

        if (groupId) {
            const group = this.groups.find(g => g.id === groupId);
            title.textContent = 'Редактировать группу';
            document.getElementById('group-name').value = group.name;
            document.getElementById('group-description').value = group.description || '';
            document.getElementById('group-color').value = group.color;
            
            // Set schedule
            Object.keys(group.schedule || {}).forEach(day => {
                const checkbox = document.getElementById(day);
                const timeInput = document.getElementById(`${day}-time`);
                if (checkbox && timeInput) {
                    checkbox.checked = !!group.schedule[day];
                    timeInput.disabled = !checkbox.checked;
                    timeInput.value = group.schedule[day] || '';
                }
            });
        } else {
            title.textContent = 'Создать группу';
            form.reset();
            document.getElementById('group-color').value = '#2563eb';
            
            // Reset schedule
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
                const checkbox = document.getElementById(day);
                const timeInput = document.getElementById(`${day}-time`);
                if (checkbox && timeInput) {
                    checkbox.checked = false;
                    timeInput.disabled = true;
                    timeInput.value = '';
                }
            });
        }

        this.showModal(modal);
    }

    async saveGroup(e) {
        e.preventDefault();
        
        const schedule = {};
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
            const checkbox = document.getElementById(day);
            const timeInput = document.getElementById(`${day}-time`);
            if (checkbox && checkbox.checked && timeInput && timeInput.value) {
                schedule[day] = timeInput.value;
            }
        });

        const groupData = {
            id: this.currentGroupId || Date.now().toString(),
            name: document.getElementById('group-name').value,
            description: document.getElementById('group-description').value,
            color: document.getElementById('group-color').value,
            schedule: schedule
        };

        if (this.currentGroupId) {
            const index = this.groups.findIndex(g => g.id === this.currentGroupId);
            this.groups[index] = groupData;
        } else {
            this.groups.push(groupData);
        }

        await this.saveToDB('groups', groupData);
        this.renderGroups();
        this.updateStats();
        this.closeModal();
        this.currentGroupId = null;
    }

    editGroup(id) {
        this.openGroupModal(id);
    }

    openJournalForGroup(groupId) {
        this.switchSection('journal'); // This will push 'journal' to history
        setTimeout(() => {
            document.getElementById('group-select').value = groupId;
            this.loadJournal(groupId, new Date()); // Load for current month
            document.querySelector('.back-button').style.display = 'inline-flex'; // Ensure back button is visible
        }, 100);
    }

    generateMonthlyJournal(group, month) {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
        
        const weeks = [];
        let currentWeek = [];
        
        // Fill leading empty days for the first week
        const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Monday is 0, Sunday is 6
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null); // Use null for padding
        }

        // Fill days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const currentDate = new Date(year, monthIndex, day);
            const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1; // 0 for Monday, 6 for Sunday
            const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];
            
            const hasLesson = group.schedule && group.schedule[dayName];

            currentWeek.push({
                date: currentDate,
                hasLesson: hasLesson,
                time: hasLesson ? group.schedule[dayName] : null
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        // Fill trailing empty days for the last week
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    }

    showGroupStudents(groupId) {
        this.switchSection('students'); // This will push 'students' to history
        setTimeout(() => {
            document.getElementById('student-filter').value = 'active';
            const groupStudents = this.students.filter(s => s.group === groupId && s.status === 'active');
            this.displayStudents(groupStudents);
            document.querySelector('.back-button').style.display = 'inline-flex'; // Ensure back button is visible
        }, 100);
    }

    // Journal
    renderJournal() {
        this.populateJournalGroupSelect();
        this.updateMonthDisplay();
        this.updateWeekDisplay();
        this.updateJournalViewUI(); // Ensure UI reflects the default 'week' view
        // If a group is already selected, load the journal for it
        if (this.currentJournalGroupId) {
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        } else if (this.groups.length > 0) {
            // Automatically select the first group if none is selected
            this.currentJournalGroupId = this.groups[0].id;
            document.getElementById('group-select').value = this.currentJournalGroupId;
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        }
    }

    updateMonthDisplay() {
        const display = document.getElementById('current-month-display');
        if (display) {
            display.textContent = this.currentJournalMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
        }
    }

    updateWeekDisplay() {
        const display = document.getElementById('current-week-display');
        if (display) {
            display.textContent = `Неделя ${this.currentJournalWeek + 1}`;
        }
    }

    prevMonth() {
        this.currentJournalMonth.setMonth(this.currentJournalMonth.getMonth() - 1);
        this.updateMonthDisplay();
        if (this.currentJournalGroupId) {
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        }
    }

    nextMonth() {
        this.currentJournalMonth.setMonth(this.currentJournalMonth.getMonth() + 1);
        this.updateMonthDisplay();
        if (this.currentJournalGroupId) {
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        }
    }

    prevWeek() {
        if (this.currentJournalWeek > 0) {
            this.currentJournalWeek--;
            this.updateWeekDisplay();
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        }
    }

    nextWeek() {
        const group = this.groups.find(g => g.id === this.currentJournalGroupId);
        if (group) {
            const weeksInMonth = this.generateMonthlyJournal(group, this.currentJournalMonth).length;
            if (this.currentJournalWeek < weeksInMonth - 1) {
                this.currentJournalWeek++;
                this.updateWeekDisplay();
                this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
            }
        }
    }

    populateJournalGroupSelect() {
        const select = document.getElementById('group-select');
        if (!select) return;

        select.innerHTML = '<option value="">Выберите группу</option>' +
            this.groups.map(group => `<option value="${group.id}">${group.name}</option>`).join('');
    }

    loadJournal(groupId, month = new Date()) {
        if (!groupId) return;

        this.currentJournalGroupId = groupId;
        this.currentJournalMonth = month;

        const groupStudents = this.students.filter(s => s.group === groupId && s.status === 'active');
        
        if (this.currentJournalView === 'week') {
            this.renderJournalTable(groupStudents, month);
        } else {
            this.renderMonthlySummary(groupStudents, groupId, month);
        }
        
        this.renderGradesChart(groupStudents, groupId, month);
    }

    renderJournalTable(students, month) {
        const tbody = document.getElementById('journal-tbody');
        if (!tbody) return;

        const group = this.groups.find(g => g.id === this.currentJournalGroupId);
        if (!group || !group.schedule) {
            tbody.innerHTML = '<tr><td colspan="10">Расписание для этой группы не задано.</td></tr>';
            return;
        }

        const monthlyWeeks = this.generateMonthlyJournal(group, month);
        const currentWeekData = monthlyWeeks[this.currentJournalWeek];
        
        if (!currentWeekData) {
            tbody.innerHTML = '<tr><td colspan="10">Данные для этой недели отсутствуют.</td></tr>';
            return;
        }

        const lessonDaysInWeek = currentWeekData.filter(day => day && day.hasLesson);
        const daysInWeekCount = lessonDaysInWeek.length;

        // Update table header for the week
        const journalTable = document.getElementById('journal-table');
        const thead = journalTable.querySelector('thead');
        thead.innerHTML = `
            <tr>
                <th rowspan="2">Студент</th>
                <th colspan="${daysInWeekCount * 3}">Неделя ${this.currentJournalWeek + 1} (${month.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })})</th>
                <th rowspan="2">Бонусы</th>
                <th rowspan="2">Итог</th>
            </tr>
            <tr id="journal-dates-row"></tr>
        `;

        const datesRow = document.getElementById('journal-dates-row');
        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        lessonDaysInWeek.forEach(day => {
            datesRow.innerHTML += `
                <th colspan="3">${dayNames[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1]}<br>${day.date.getDate()}</th>
            `;
        });
        
        tbody.innerHTML = students.map(student => {
            const monthYear = month.toISOString().substring(0, 7);
            const monthlyAssessment = this.monthlyAssessments[this.currentJournalGroupId]?.[monthYear]?.[student.id] || { examScore: 0, bonusPoints: 0, finalGrade: 0, weeklyBonuses: {} };
            const weeklyBonus = monthlyAssessment.weeklyBonuses?.[this.currentJournalWeek] || 0;

            let totalGradesForWeek = 0;
            lessonDaysInWeek.forEach(day => {
                const dateKey = day.date.toISOString().split('T')[0];
                const studentDayData = (this.journal[this.currentJournalGroupId]?.[dateKey]?.[student.id]) || {};
                if (studentDayData.grade && studentDayData.grade > 0) {
                    totalGradesForWeek += Number(studentDayData.grade);
                }
            });

            const daysCells = lessonDaysInWeek.map(day => {
                const dateKey = day.date.toISOString().split('T')[0];
                const studentDayData = (this.journal[this.currentJournalGroupId]?.[dateKey]?.[student.id]) || {};
                const attendance = studentDayData.attendance || false;
                const grade = Number(studentDayData.grade) || 0; // Ensure grade is a number
                const comment = studentDayData.comment || '';
                
                return `
                    <td>
                        <input type="checkbox" ${attendance ? 'checked' : ''}
                               onchange="app.updateAttendance('${this.currentJournalGroupId}', '${dateKey}', '${student.id}', this.checked, event)">
                    </td>
                    <td>
                        <input type="number" min="0" max="${this.settings.maxGrade}" value="${grade || ''}"
                               onchange="app.updateGrade('${this.currentJournalGroupId}', '${dateKey}', '${student.id}', this.value, event)">
                    </td>
                    <td>
                        <button class="action-btn small ${comment ? 'has-comment' : ''}" onclick="app.openCommentModal('${this.currentJournalGroupId}', '${dateKey}', '${student.id}')">
                            <i data-lucide="message-square"></i>
                        </button>
                    </td>
                `;
            }).join('');

            const totalSum = totalGradesForWeek + weeklyBonus;

            return `
                <tr>
                    <td class="student-name" onclick="app.showStudentAnalytics('${student.id}')">${student.name} ${student.surname}</td>
                    ${daysCells}
                    <td>
                        <input type="number" min="0" max="10" value="${weeklyBonus || ''}"
                               onchange="app.updateBonus('${this.currentJournalGroupId}', '${student.id}', ${this.currentJournalWeek}, this.value)">
                    </td>
                    <td class="total-cell" id="total-${student.id}">${totalSum}</td>
                </tr>
            `;
        }).join('');
        lucide.createIcons(); // Re-render lucide icons for the newly added tbody content
    }

    async updateAttendance(groupId, date, studentId, attended, event) {
        if (event) event.preventDefault(); // Prevent any default form submission or navigation

        const journalTableContainer = document.querySelector('.journal-table-container');
        const scrollTop = journalTableContainer ? journalTableContainer.scrollTop : 0;

        if (!this.journal[groupId]) this.journal[groupId] = {};
        if (!this.journal[groupId][date]) this.journal[groupId][date] = {};
        if (!this.journal[groupId][date][studentId]) this.journal[groupId][date][studentId] = {};
        
        this.journal[groupId][date][studentId].attendance = attended;
        await this.saveToDB('journal', { id: `${groupId}-${date}`, groupId, date, data: this.journal[groupId][date] });
        
        this.updateStudentTotal(studentId);
        this.updateStats();
        this.renderGradesChart(
            this.students.filter(s => s.group === groupId && s.status === 'active'),
            groupId,
            this.currentJournalMonth
        );

        if (journalTableContainer) {
            journalTableContainer.scrollTop = scrollTop;
        }
    }

    async updateGrade(groupId, date, studentId, grade, event) {
        if (event) event.preventDefault(); // Prevent any default form submission or navigation

        const journalTableContainer = document.querySelector('.journal-table-container');
        const scrollTop = journalTableContainer ? journalTableContainer.scrollTop : 0;

        if (!this.journal[groupId]) this.journal[groupId] = {};
        if (!this.journal[groupId][date]) this.journal[groupId][date] = {};
        if (!this.journal[groupId][date][studentId]) this.journal[groupId][date][studentId] = {};
        
        this.journal[groupId][date][studentId].grade = parseInt(grade) || 0;
        await this.saveToDB('journal', { id: `${groupId}-${date}`, groupId, date, data: this.journal[groupId][date] });
        
        this.updateStudentTotal(studentId);
        this.updateStats();
        this.renderGradesChart(
            this.students.filter(s => s.group === groupId && s.status === 'active'),
            groupId,
            this.currentJournalMonth
        );

        if (journalTableContainer) {
            journalTableContainer.scrollTop = scrollTop;
        }
    }

    openCommentModal(groupId, date, studentId) {
        this.currentCommentContext = { groupId, date, studentId };
        const modal = document.getElementById('comment-modal');
        const commentTextarea = document.getElementById('comment-text');
        
        const studentDayData = (this.journal[groupId]?.[date]?.[studentId]) || {};
        commentTextarea.value = studentDayData.comment || '';
        
        this.showModal(modal);
        lucide.createIcons(); // Re-render lucide icons for the modal
    }

    async saveComment(e) {
        e.preventDefault();
        const { groupId, date, studentId } = this.currentCommentContext;
        const comment = document.getElementById('comment-text').value;

        if (!this.journal[groupId]) this.journal[groupId] = {};
        if (!this.journal[groupId][date]) this.journal[groupId][date] = {};
        if (!this.journal[groupId][date][studentId]) this.journal[groupId][date][studentId] = {};
        
        this.journal[groupId][date][studentId].comment = comment;
        await this.saveToDB('journal', { id: `${groupId}-${date}`, groupId, date, data: this.journal[groupId][date] });
        
        this.closeModal();
        this.renderJournalTable(
            this.students.filter(s => s.group === groupId && s.status === 'active'),
            this.currentJournalMonth
        ); // Re-render table to update comment icon state
    }

    async updateBonus(groupId, studentId, weekIndex, bonus) {
        const monthYear = this.currentJournalMonth.toISOString().substring(0, 7); // YYYY-MM
        if (!this.monthlyAssessments[groupId]) this.monthlyAssessments[groupId] = {};
        if (!this.monthlyAssessments[groupId][monthYear]) this.monthlyAssessments[groupId][monthYear] = {};
        if (!this.monthlyAssessments[groupId][monthYear][studentId]) {
            this.monthlyAssessments[groupId][monthYear][studentId] = { examScore: 0, bonusPoints: 0, finalGrade: 0, weeklyBonuses: {} };
        }
        
        this.monthlyAssessments[groupId][monthYear][studentId].weeklyBonuses[weekIndex] = parseInt(bonus) || 0;
        // Recalculate total monthly bonusPoints for backward compatibility or monthly summary display
        this.monthlyAssessments[groupId][monthYear][studentId].bonusPoints = Object.values(this.monthlyAssessments[groupId][monthYear][studentId].weeklyBonuses).reduce((sum, b) => sum + b, 0);

        await this.saveToDB('monthlyAssessments', {
            id: `${groupId}-${monthYear}-${studentId}`, // Unique ID for monthly assessment per student
            groupId,
            monthYear,
            studentId,
            data: this.monthlyAssessments[groupId][monthYear][studentId]
        });
        
        this.updateStudentTotal(studentId);
        this.renderGradesChart(
            this.students.filter(s => s.group === groupId && s.status === 'active'),
            groupId,
            this.currentJournalMonth
        );
    }

    async updateExamScore(groupId, studentId, examScore) {
        const monthYear = this.currentJournalMonth.toISOString().substring(0, 7); // YYYY-MM
        if (!this.monthlyAssessments[groupId]) this.monthlyAssessments[groupId] = {};
        if (!this.monthlyAssessments[groupId][monthYear]) this.monthlyAssessments[groupId][monthYear] = {};
        if (!this.monthlyAssessments[groupId][monthYear][studentId]) {
            this.monthlyAssessments[groupId][monthYear][studentId] = { examScore: 0, bonusPoints: 0, finalGrade: 0 };
        }
        
        this.monthlyAssessments[groupId][monthYear][studentId].examScore = parseInt(examScore) || 0;
        await this.saveToDB('monthlyAssessments', {
            id: `${groupId}-${monthYear}-${studentId}`, // Unique ID for monthly assessment per student
            groupId,
            monthYear,
            studentId,
            data: this.monthlyAssessments[groupId][monthYear][studentId]
        });
        
        this.updateMonthlyStudentTotal(studentId);
    }

    updateStudentTotal(studentId) {
        const groupId = this.currentJournalGroupId;
        if (!groupId) return;

        const group = this.groups.find(g => g.id === groupId);
        if (!group || !group.schedule) return;

        const monthlyWeeks = this.generateMonthlyJournal(group, this.currentJournalMonth);
        const currentWeekData = monthlyWeeks[this.currentJournalWeek];
        
        if (!currentWeekData) return;

        let totalGradesForWeek = 0;
        currentWeekData.forEach(day => {
            if (day && day.hasLesson) {
                const dateKey = day.date.toISOString().split('T')[0];
                const studentDayData = (this.journal[groupId]?.[dateKey]?.[studentId]) || {};
                if (studentDayData.grade && studentDayData.grade > 0) {
                    totalGradesForWeek += Number(studentDayData.grade);
                }
            }
        });

        const monthYear = this.currentJournalMonth.toISOString().substring(0, 7);
        const monthlyAssessment = this.monthlyAssessments[groupId]?.[monthYear]?.[studentId] || { examScore: 0, bonusPoints: 0, finalGrade: 0, weeklyBonuses: {} };
        const weeklyBonus = monthlyAssessment.weeklyBonuses?.[this.currentJournalWeek] || 0;
        
        const total = totalGradesForWeek + weeklyBonus;
        
        const totalCell = document.getElementById(`total-${studentId}`);
        if (totalCell) totalCell.textContent = total;

        // No need to re-render monthly summary here, as this function is for weekly total
    }

    updateMonthlyStudentTotal(studentId) {
        const groupId = this.currentJournalGroupId;
        if (!groupId) return;

        const monthYear = this.currentJournalMonth.toISOString().substring(0, 7); // YYYY-MM
        const monthlyAssessment = this.monthlyAssessments[groupId]?.[monthYear]?.[studentId] || { examScore: 0, bonusPoints: 0, finalGrade: 0, weeklyBonuses: {} };
        monthlyAssessment.weeklyBonuses = monthlyAssessment.weeklyBonuses || {}; // Ensure it's an object

        let totalGradesForMonth = 0;
        const groupJournal = this.journal[groupId] || {};
        for (const dateKey in groupJournal) {
            if (dateKey.startsWith(monthYear) && groupJournal[dateKey][studentId] && groupJournal[dateKey][studentId].grade) {
                totalGradesForMonth += Number(groupJournal[dateKey][studentId].grade);
            }
        }

        const totalMonthlyBonus = Object.values(monthlyAssessment.weeklyBonuses).reduce((sum, b) => sum + b, 0);
        const totalSum = totalGradesForMonth + totalMonthlyBonus + monthlyAssessment.examScore;

        // Find the specific monthly-summary-card for this student and update its total
        // This assumes student names are unique enough or we need a more robust selector
        const studentCard = document.querySelector(`#monthly-summary-grid .monthly-summary-card[data-student-id="${studentId}"]`);
        if (studentCard) {
            const totalGradeElement = studentCard.querySelector('.total-grade');
            if (totalGradeElement) {
                totalGradeElement.textContent = `Итог: ${totalSum}`;
            }
        }
    }

    renderGradesChart(students, groupId, month) {
        const ctx = document.getElementById('gradesChart');
        if (!ctx) return;

        const group = this.groups.find(g => g.id === groupId);
        if (!group || !group.schedule) {
            ctx.innerHTML = '<p>Расписание для этой группы не задано, невозможно построить график.</p>';
            if (this.gradesChart) {
                this.gradesChart.destroy();
                this.gradesChart = null;
            }
            return;
        }

        const monthlyWeeks = this.generateMonthlyJournal(group, month);
        const labels = monthlyWeeks.map((_, index) => `Неделя ${index + 1}`);

        let maxTotalScore = 0; // To dynamically set y-axis max

        const datasets = students.map((student, studentIndex) => {
            const studentWeeklyScores = monthlyWeeks.map(weekData => {
                let weekTotalGrade = 0;
                weekData.forEach(day => {
                    if (day && day.hasLesson) {
                        const dateKey = day.date.toISOString().split('T')[0];
                        const studentDayData = (this.journal[groupId]?.[dateKey]?.[student.id]) || {};
                        if (studentDayData.grade && studentDayData.grade > 0) {
                            weekTotalGrade += Number(studentDayData.grade);
                        }
                    }
                });
                maxTotalScore = Math.max(maxTotalScore, weekTotalGrade); // Update max total score
                return weekTotalGrade; // Total grade for the week
            });

            // Generate a distinct color for each student
            const colors = [
                '#2563eb', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#eab308', '#06b6d4', '#6b7280',
                '#be185d', '#4ade80', '#facc15', '#a78bfa', '#f87171', '#fbbf24', '#22d3ee', '#9ca3af'
            ];
            const studentColor = colors[studentIndex % colors.length];

            return {
                label: `${student.name} ${student.surname}`,
                data: studentWeeklyScores,
                borderColor: studentColor,
                backgroundColor: studentColor,
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: studentColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            };
        });

        // Adjust maxTotalScore to be a bit higher than the actual max for better visualization
        const yAxisMax = maxTotalScore > 0 ? Math.ceil(maxTotalScore / 5) * 5 + 5 : 10; // Ensure a reasonable max, e.g., multiple of 5, min 10

        if (this.gradesChart) {
            // Update existing chart data
            this.gradesChart.data.labels = labels;
            this.gradesChart.data.datasets = datasets;
            this.gradesChart.options.scales.y.max = yAxisMax; // Update y-axis max
            this.gradesChart.options.scales.y.ticks.stepSize = yAxisMax > 10 ? Math.ceil(yAxisMax / 10) : 1;
            this.gradesChart.update();
        } else {
            // Create new chart if it doesn't exist
            this.gradesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                title: function(context) {
                                    return context[0].label;
                                },
                                label: function(context) {
                                    const studentName = context.dataset.label;
                                    const score = context.parsed.y;
                                    return `${studentName}: ${score}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Недели',
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: yAxisMax, // Dynamically set max value
                            title: {
                                display: true,
                                text: 'Итоговый балл',
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                stepSize: yAxisMax > 10 ? Math.ceil(yAxisMax / 10) : 1 // Adjust step size based on max value
                            }
                        }
                    }
                }
            });
        }
    }

    renderMonthlySummary(students, groupId, month) {
        const grid = document.getElementById('monthly-summary-grid');
        if (!grid) return;

        const monthYear = month.toISOString().substring(0, 7); // YYYY-MM

        if (students.length === 0) {
            grid.innerHTML = '<p class="no-data">Нет активных студентов в этой группе для отображения ежемесячного отчета.</p>';
            return;
        }

        grid.innerHTML = students.map(student => {
            const monthlyAssessment = this.monthlyAssessments[groupId]?.[monthYear]?.[student.id] || { examScore: 0, bonusPoints: 0, finalGrade: 0, weeklyBonuses: {} };
            // Ensure weeklyBonuses is an object, even if monthlyAssessment exists but lacks the property
            monthlyAssessment.weeklyBonuses = monthlyAssessment.weeklyBonuses || {};
            
            let totalGradesForMonth = 0;
            const groupJournal = this.journal[groupId] || {};
            for (const dateKey in groupJournal) {
                if (dateKey.startsWith(monthYear) && groupJournal[dateKey][student.id] && groupJournal[dateKey][student.id].grade) {
                    totalGradesForMonth += Number(groupJournal[dateKey][student.id].grade);
                }
            }

            // Sum all weekly bonuses for the monthly total
            const totalMonthlyBonus = Object.values(monthlyAssessment.weeklyBonuses).reduce((sum, b) => sum + b, 0);

            const totalSum = totalGradesForMonth + totalMonthlyBonus + monthlyAssessment.examScore;

            return `
                <div class="monthly-summary-card animate-fade-in" data-student-id="${student.id}">
                    <h4>${student.name} ${student.surname}</h4>
                    <div class="monthly-summary-item">
                        <span class="label">Баллы за занятия:</span>
                        <span class="value">${totalGradesForMonth}</span>
                    </div>
                    <div class="monthly-summary-item">
                        <span class="label">Баллы за экзамен:</span>
                        <input type="number" min="0" max="100" value="${monthlyAssessment.examScore || ''}"
                               onchange="app.updateExamScore('${groupId}', '${student.id}', this.value)">
                    </div>
                    <div class="monthly-summary-item">
                        <span class="label">Бонусные баллы:</span>
                        <span class="value">${totalMonthlyBonus}</span>
                    </div>
                    <div class="total-grade">Итог: ${totalSum}</div>
                </div>
            `;
        }).join('');
    }

    toggleJournalView() {
        this.currentJournalView = this.currentJournalView === 'month' ? 'week' : 'month';
        this.currentJournalWeek = 0; // Reset to the first week when toggling
        this.updateJournalViewUI();
        if (this.currentJournalGroupId) {
            this.loadJournal(this.currentJournalGroupId, this.currentJournalMonth);
        }
    }

    updateJournalViewUI() {
        const weeklyView = document.getElementById('weekly-journal-view');
        const monthlyView = document.getElementById('monthly-summary-view');
        const monthNav = document.querySelector('.month-navigation');
        const weekNav = document.querySelector('.week-navigation');
        const toggleBtn = document.getElementById('toggle-view-btn');

        if (this.currentJournalView === 'week') {
            weeklyView.style.display = 'grid';
            monthlyView.style.display = 'none';
            monthNav.style.display = 'none';
            weekNav.style.display = 'flex';
            toggleBtn.textContent = 'Месяц';
        } else {
            weeklyView.style.display = 'none';
            monthlyView.style.display = 'block';
            monthNav.style.display = 'flex';
            weekNav.style.display = 'none';
            toggleBtn.textContent = 'Неделя';
        }
    }

    // Reports
    renderReports() {
        // Reports are rendered in HTML, just need event listeners
    }

    openReportOptionsModal(reportType) {
        this.currentReportType = reportType;
        const modal = document.getElementById('report-options-modal');
        const titleElement = document.getElementById('report-options-modal-title');
        
        const titles = {
            attendance: 'Отчет по посещаемости',
            grades: 'Отчет по успеваемости',
            activity: 'Отчет по активности групп'
        };
        titleElement.textContent = titles[reportType] || 'Параметры отчета';

        this.populateReportGroupSelect();
        this.populateReportStudentSelect('all'); // Initially populate with all students
        this.updateReportDateRange('all'); // Set default dates based on all groups

        this.showModal(modal);
        lucide.createIcons();
    }

    getMinMaxJournalDates(groupId = 'all') {
        let minDate = null;
        let maxDate = null;

        const groupsToConsider = groupId === 'all' ? this.groups : this.groups.filter(g => g.id === groupId);

        groupsToConsider.forEach(group => {
            const groupJournal = this.journal[group.id] || {};
            for (const dateKey in groupJournal) {
                const entryDate = new Date(dateKey);
                const dayOfWeek = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];

                // Only consider dates where a lesson was scheduled
                if (group.schedule && group.schedule[dayName]) {
                    if (!minDate || entryDate < minDate) {
                        minDate = entryDate;
                    }
                    if (!maxDate || entryDate > maxDate) {
                        maxDate = entryDate;
                    }
                }
            }
        });

        // If no journal entries, default to current month
        if (!minDate || !maxDate) {
            const today = new Date();
            minDate = new Date(today.getFullYear(), today.getMonth(), 1);
            maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        return { minDate, maxDate };
    }

    populateReportGroupSelect() {
        const select = document.getElementById('report-group-select');
        select.innerHTML = '<option value="all">Все группы</option>' +
            this.groups.map(group => `<option value="${group.id}">${group.name}</option>`).join('');
        
        // Add event listener to update dates when group selection changes
        select.removeEventListener('change', this.handleReportGroupChange); // Remove existing to prevent duplicates
        select.addEventListener('change', (e) => this.handleReportGroupChange(e));
    }

    handleReportGroupChange(e) {
        const groupId = e.target.value;
        this.populateReportStudentSelect(groupId);
        this.updateReportDateRange(groupId);
    }

    updateReportDateRange(groupId) {
        const { minDate, maxDate } = this.getMinMaxJournalDates(groupId);
        document.getElementById('report-start-date').value = minDate.toISOString().split('T')[0];
        document.getElementById('report-end-date').value = maxDate.toISOString().split('T')[0];
    }

    populateReportStudentSelect(groupId) {
        const select = document.getElementById('report-student-select');
        select.innerHTML = '<option value="all">Все студенты</option>';
        select.disabled = false;

        let studentsToDisplay = this.students.filter(s => s.status === 'active');

        if (groupId !== 'all') {
            studentsToDisplay = studentsToDisplay.filter(s => s.group === groupId);
        }

        select.innerHTML += studentsToDisplay.map(student =>
            `<option value="${student.id}">${student.name} ${student.surname}</option>`
        ).join('');

        // Add event listener to auto-select group when a student is chosen
        select.removeEventListener('change', this.handleReportStudentChange);
        select.addEventListener('change', (e) => this.handleReportStudentChange(e));
    }

    handleReportStudentChange(e) {
        const studentId = e.target.value;
        if (studentId !== 'all') {
            const student = this.students.find(s => s.id === studentId);
            if (student && student.group) {
                document.getElementById('report-group-select').value = student.group;
                // Manually trigger change event to update date ranges if needed
                document.getElementById('report-group-select').dispatchEvent(new Event('change'));
            }
        }
    }

    async handleReportOptionsSubmit(e) {
        e.preventDefault();
        this.closeModal(); // Close options modal

        const groupId = document.getElementById('report-group-select').value;
        const studentId = document.getElementById('report-student-select').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;

        let reportContent = '';
        let reportTitle = '';

        switch (this.currentReportType) {
            case 'attendance':
                reportTitle = 'Отчет по посещаемости';
                reportContent = this.generateAttendanceReport(groupId, studentId, startDate, endDate);
                break;
            case 'grades':
                reportTitle = 'Успеваемость студентов';
                reportContent = this.generateGradesReport(groupId, studentId, startDate, endDate);
                break;
            case 'activity':
                reportTitle = 'Активность групп';
                reportContent = this.generateActivityReport(groupId, startDate, endDate);
                break;
        }

        this.showReportModal(reportTitle, reportContent);
    }

    generateAttendanceReport(filterGroupId = 'all', filterStudentId = 'all', startDate = null, endDate = null) {
        let filteredStudents = this.students.filter(s => s.status === 'active');
        if (filterGroupId !== 'all') {
            filteredStudents = filteredStudents.filter(s => s.group === filterGroupId);
        }
        if (filterStudentId !== 'all') {
            filteredStudents = filteredStudents.filter(s => s.id === filterStudentId);
        }

        const attendanceData = filteredStudents.map(student => {
            let totalActualSessions = 0; // Sessions where a journal entry exists
            let attendedSessions = 0;

            const group = this.groups.find(g => g.id === student.group);
            if (!group) return null;
            const groupSchedule = group.schedule || {};

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            const studentGroupJournal = this.journal[student.group] || {};

            for (const dateKey in studentGroupJournal) {
                const entryDate = new Date(dateKey);

                if ((start && entryDate < start) || (end && entryDate > end)) {
                    continue;
                }

                const dayOfWeek = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];

                // Only consider dates where a lesson was scheduled AND a journal entry exists for the student
                if (groupSchedule[dayName] && studentGroupJournal[dateKey][student.id]) {
                    totalActualSessions++;
                    const studentDayData = studentGroupJournal[dateKey][student.id];
                    if (studentDayData.attendance) {
                        attendedSessions++;
                    }
                }
            }

            const attendanceRate = totalActualSessions > 0 ? Math.round((attendedSessions / totalActualSessions) * 100) : 0;
            
            return {
                student: `${student.name} ${student.surname}`,
                group: group.name,
                attended: attendedSessions,
                total: totalActualSessions,
                percentage: attendanceRate
            };
        }).filter(Boolean); // Filter out null entries

        if (attendanceData.length === 0) {
            return '<p class="no-data">Нет данных для отображения по выбранным фильтрам.</p>';
        }

        let html = `
            <div class="report-section">
                <h3>Посещаемость по студентам</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>Группа</th>
                            <th>Посещено</th>
                            <th>Всего занятий</th>
                            <th>Процент</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendanceData.map(item => `
                            <tr>
                                <td>${item.student}</td>
                                <td>${item.group}</td>
                                <td>${item.attended}</td>
                                <td>${item.total}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="report-summary">
                    <div class="summary-item">
                        <div class="value">${attendanceData.length > 0 ? Math.round(attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length) : 0}%</div>
                        <div class="label">Средняя посещаемость</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${attendanceData.filter(item => item.percentage >= 80).length}</div>
                        <div class="label">Студентов с хорошей посещаемостью</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateGradesReport(filterGroupId = 'all', filterStudentId = 'all', startDate = null, endDate = null) {
        let filteredStudents = this.students.filter(s => s.status === 'active');
        if (filterGroupId !== 'all') {
            filteredStudents = filteredStudents.filter(s => s.group === filterGroupId);
        }
        if (filterStudentId !== 'all') {
            filteredStudents = filteredStudents.filter(s => s.id === filterStudentId);
        }

        const gradesData = filteredStudents.map(student => {
            let totalGrades = 0;
            let gradeCount = 0;
            let maxGrade = 0;
            let minGrade = this.settings.maxGrade;

            const studentGroupJournal = this.journal[student.group] || {};
            for (const dateKey in studentGroupJournal) {
                const entryDate = new Date(dateKey);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start) start.setHours(0, 0, 0, 0);
                if (end) end.setHours(23, 59, 59, 999);

                if ((start && entryDate < start) || (end && entryDate > end)) {
                    continue;
                }

                if (studentGroupJournal[dateKey][student.id]) {
                    const dayData = studentGroupJournal[dateKey][student.id];
                    if (dayData.grade && dayData.grade > 0) {
                        totalGrades += dayData.grade;
                        gradeCount++;
                        maxGrade = Math.max(maxGrade, dayData.grade);
                        minGrade = Math.min(minGrade, dayData.grade);
                    }
                }
            }

            const average = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(2) : 0;
            const group = this.groups.find(g => g.id === student.group);

            return {
                student: `${student.name} ${student.surname}`,
                group: group ? group.name : 'Без группы',
                average: parseFloat(average),
                total: totalGrades,
                count: gradeCount,
                max: gradeCount > 0 ? maxGrade : 0,
                min: gradeCount > 0 && minGrade < this.settings.maxGrade ? minGrade : 0
            };
        }).filter(Boolean);

        if (gradesData.length === 0) {
            return '<p class="no-data">Нет данных для отображения по выбранным фильтрам.</p>';
        }

        let html = `
            <div class="report-section">
                <h3>Успеваемость студентов</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>Группа</th>
                            <th>Средний балл</th>
                            <th>Сумма баллов</th>
                            <th>Количество оценок</th>
                            <th>Макс. оценка</th>
                            <th>Мин. оценка</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gradesData.map(item => `
                            <tr>
                                <td>${item.student}</td>
                                <td>${item.group}</td>
                                <td>${item.average}</td>
                                <td>${item.total}</td>
                                <td>${item.count}</td>
                                <td>${item.max}</td>
                                <td>${item.min || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="report-summary">
                    <div class="summary-item">
                        <div class="value">${gradesData.length > 0 ? (gradesData.reduce((sum, item) => sum + item.average, 0) / gradesData.length).toFixed(2) : 0}</div>
                        <div class="label">Средний балл по курсу</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${gradesData.filter(item => item.average >= 4).length}</div>
                        <div class="label">Студентов с хорошими оценками</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateActivityReport(filterGroupId = 'all', startDate = null, endDate = null) {
        let filteredGroups = this.groups;
        if (filterGroupId !== 'all') {
            filteredGroups = filteredGroups.filter(g => g.id === filterGroupId);
        }

        const groupData = filteredGroups.map(group => {
            const groupStudents = this.students.filter(s => s.group === group.id && s.status === 'active');
            const scheduleCount = Object.keys(group.schedule || {}).length;
            
            let totalAttendance = 0;
            let totalSessions = 0;
            
            const currentGroupJournal = this.journal[group.id] || {};
            for (const dateKey in currentGroupJournal) {
                const entryDate = new Date(dateKey);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start) start.setHours(0, 0, 0, 0);
                if (end) end.setHours(23, 59, 59, 999);

                if ((start && entryDate < start) || (end && entryDate > end)) {
                    continue;
                }

                const dayOfWeek = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];
                
                if (group.schedule && group.schedule[dayName]) {
                    groupStudents.forEach(student => {
                        if (currentGroupJournal[dateKey][student.id]) {
                            totalSessions++;
                            if (currentGroupJournal[dateKey][student.id].attendance) {
                                totalAttendance++;
                            }
                        }
                    });
                }
            }

            const attendanceRate = totalSessions > 0 ? Math.round((totalAttendance / totalSessions) * 100) : 0;

            return {
                name: group.name,
                students: groupStudents.length,
                schedule: scheduleCount,
                attendance: attendanceRate,
                color: group.color
            };
        });

        if (groupData.length === 0) {
            return '<p class="no-data">Нет данных для отображения по выбранным фильтрам.</p>';
        }

        let html = `
            <div class="report-section">
                <h3>Активность групп</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Группа</th>
                            <th>Количество студентов</th>
                            <th>Занятий в неделю</th>
                            <th>Посещаемость</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupData.map(item => {
                            const status = item.attendance >= 80 ? 'Активная' : item.attendance >= 60 ? 'Средняя' : 'Низкая';
                            return `
                                <tr>
                                    <td style="border-left: 4px solid ${item.color}; padding-left: 12px;">${item.name}</td>
                                    <td>${item.students}</td>
                                    <td>${item.schedule}</td>
                                    <td>${item.attendance}%</td>
                                    <td>${status}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="report-summary">
                    <div class="summary-item">
                        <div class="value">${groupData.length}</div>
                        <div class="label">Всего групп</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${groupData.filter(item => item.attendance >= 80).length}</div>
                        <div class="label">Активных групп</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${groupData.reduce((sum, item) => sum + item.students, 0)}</div>
                        <div class="label">Студентов в группах</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    showReportModal(title, content) {
        const modal = document.getElementById('report-modal');
        const titleElement = document.getElementById('report-modal-title');
        const contentElement = document.getElementById('report-content');

        titleElement.textContent = title;
        contentElement.innerHTML = content;

        this.showModal(modal);
    }

    // Settings
    renderSettings() {
        document.getElementById('institution-name').value = this.settings.institutionName;
        document.getElementById('academic-year').value = this.settings.academicYear;
        document.getElementById('max-grade').value = this.settings.maxGrade;
        document.getElementById('bonus-system').value = this.settings.bonusSystem;
    }

    async saveSettings() {
        this.settings.institutionName = document.getElementById('institution-name').value;
        this.settings.academicYear = document.getElementById('academic-year').value;
        this.settings.maxGrade = parseInt(document.getElementById('max-grade').value);
        this.settings.bonusSystem = document.getElementById('bonus-system').value;

        // Save to database
        for (const [key, value] of Object.entries(this.settings)) {
            await this.saveToDB('settings', { key, value });
        }

        // Show success message
        const btn = document.getElementById('save-settings');
        const originalText = btn.textContent;
        btn.textContent = 'Сохранено!';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '#2563eb';
        }, 2000);
    }

    // Student Analytics
    showStudentAnalytics(studentId) {
        this.currentStudentId = studentId;
        this.switchSection('student-analytics'); // This will push 'student-analytics' to history
        this.renderStudentAnalytics();
        document.querySelector('.back-button').style.display = 'inline-flex'; // Ensure back button is visible
    }

    renderStudentAnalytics() {
        const student = this.students.find(s => s.id === this.currentStudentId);
        if (!student) return;
    
        const group = this.groups.find(g => g.id === student.group);
        const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
    
        document.getElementById('analytics-student-name').textContent = `${student.name} ${student.surname}`;
        document.getElementById('analytics-student-group').textContent = group ? group.name : 'Без группы';
    
        const avatarElement = document.getElementById('analytics-student-avatar');
        avatarElement.textContent = initials;
        avatarElement.style.background = student.avatarColor || this.getRandomColor();
        avatarElement.style.color = 'white';
    
        const { attendedSessions, totalScheduledSessions } = this.calculateStudentAttendance(student.id);
        const attendanceRate = totalScheduledSessions > 0 ? Math.round((attendedSessions / totalScheduledSessions) * 100) : 0;
    
        let totalGrades = 0;
        let gradeCount = 0;
        const studentComments = [];
    
        const studentGroup = this.groups.find(g => g.id === student.group);
        if (studentGroup) {
            const studentJournal = this.journal[student.group] || {};
            for (const dateKey in studentJournal) {
                const studentDayData = studentJournal[dateKey][student.id];
                if (studentDayData) {
                    if (studentDayData.grade && studentDayData.grade > 0) {
                        totalGrades += Number(studentDayData.grade);
                        gradeCount++;
                    }
                    if (studentDayData.comment) {
                        studentComments.push({
                            date: dateKey,
                            comment: studentDayData.comment,
                            groupName: studentGroup.name
                        });
                    }
                }
            }
        }
    
        const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(1) : 0;
    
        this.animateNumber('analytics-attendance-rate', attendanceRate, '%');
        this.animateNumber('analytics-average-grade', averageGrade);
    
        this.renderStudentGradesChart(student.id);
        this.renderStudentRecentComments(studentComments);
        lucide.createIcons();
    }

    renderStudentGradesChart(studentId) {
        const ctx = document.getElementById('studentGradesChart');
        if (!ctx) return;

        const studentGrades = [];
        const labels = [];

        // Collect all grades for the student across all groups and dates
        for (const groupId in this.journal) {
            for (const dateKey in this.journal[groupId]) {
                if (this.journal[groupId][dateKey][studentId] && this.journal[groupId][dateKey][studentId].grade) {
                    labels.push(dateKey);
                    studentGrades.push(Number(this.journal[groupId][dateKey][studentId].grade));
                }
            }
        }

        // Sort by date
        const sortedData = labels.map((label, index) => ({ date: new Date(label), grade: studentGrades[index] }))
                                 .sort((a, b) => a.date - b.date);
        
        const sortedLabels = sortedData.map(item => item.date.toLocaleDateString('ru-RU'));
        const sortedGrades = sortedData.map(item => item.grade);

        if (this.studentGradesChart) {
            this.studentGradesChart.destroy();
        }

        this.studentGradesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: 'Оценки студента',
                    data: sortedGrades,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Оценка: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Дата',
                            color: '#333',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: this.settings.maxGrade,
                        title: {
                            display: true,
                            text: 'Оценка',
                            color: '#333',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    renderStudentRecentComments(comments) {
        const container = document.getElementById('analytics-recent-comments');
        if (!container) return;

        if (comments.length === 0) {
            container.innerHTML = '<p class="no-comments">Нет комментариев для этого студента.</p>';
            return;
        }

        // Sort comments by date, newest first
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = comments.map(comment => `
            <div class="activity-item">
                <div class="activity-icon orange">
                    <i data-lucide="message-square"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${comment.groupName}</strong> (${new Date(comment.date).toLocaleDateString('ru-RU')}): ${comment.comment}</p>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // Modal functions
    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
        
        // Reset forms
        document.querySelectorAll('.modal form').forEach(form => form.reset());
        this.updateBackButtonVisibility(); // Update back button visibility after closing modal
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    exportReportToPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const reportTitle = document.getElementById('report-modal-title').textContent;
        const reportContentElement = document.getElementById('report-content');
        console.log('Report HTML Content:', reportContentElement.innerHTML); // Log HTML content

        // Add a font that supports Cyrillic characters.
        // This is a common approach for jsPDF with custom fonts.
        // You would typically load a .ttf file and convert it to a Base64 string.
        // For this example, we'll use a placeholder for a common font like 'Roboto-Regular'.
        // In a real application, you'd need to ensure this font data is correctly loaded.
        // For now, we'll use 'helvetica' as a fallback and hope for the best with Cyrillic.
        // A proper solution would involve including a font file and registering it.
        // Example of adding a font (requires font data in Base64):
        // doc.addFileToVFS('Roboto-Regular.ttf', 'BASE64_ENCODED_ROBOTO_FONT_DATA_HERE');
        // doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        // doc.setFont('Roboto');

        doc.setFont('helvetica'); // Fallback to helvetica, which might have some Cyrillic support
        doc.setFontSize(18);
        doc.text(reportTitle, 14, 22);

        // Extract table data
        const table = reportContentElement.querySelector('table');
        if (table) {
            // Extract headers, handling potential nested headers if present (though not in current HTML)
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            const body = Array.from(table.querySelectorAll('tbody tr')).map(row =>
                Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim())
            );
            console.log('PDF Table Headers:', headers); // Log headers
            console.log('PDF Table Body:', body); // Log body

            doc.autoTable({
                startY: 30,
                head: [headers],
                body: body,
                theme: 'grid',
                styles: {
                    font: 'helvetica', // Use the fallback font
                    fontSize: 10,
                    cellPadding: 3,
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0]
                },
                headStyles: {
                    fillColor: [235, 235, 235],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });
        } else {
            // If no table, just add the raw HTML content (simplified)
            doc.setFontSize(12);
            doc.html(reportContentElement, {
                callback: function (doc) {
                    doc.save(`${reportTitle}.pdf`);
                },
                x: 10,
                y: 30,
                width: 180, // Max width of content
                windowWidth: 650 // Window width used to render HTML.
            });
            return;
        }

        doc.save(`${reportTitle}.pdf`);
    }
    applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle').checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            document.getElementById('theme-toggle').checked = false;
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    goBack() {
        if (this.navigationHistory.length > 1) {
            this.navigationHistory.pop(); // Remove current section
            const previousSection = this.navigationHistory[this.navigationHistory.length - 1];
            this.switchSection(previousSection, false); // Switch without adding to history again
        }
        this.updateBackButtonVisibility();
    }

    updateBackButtonVisibility() {
        const backButton = document.querySelector('.back-button');
        if (this.navigationHistory.length > 1 && this.currentSection !== 'dashboard') {
            backButton.style.display = 'inline-flex';
        } else {
            backButton.style.display = 'none';
        }
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EduCRM();
});

// Export for PDF
document.getElementById('export-report')?.addEventListener('click', () => {
    app.exportReportToPdf();
});
