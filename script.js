
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
        this.currentAnalyticsMonth = new Date(); // Initialize with current date for student analytics
        this.students = [];
        this.groups = [];
        this.journal = {}; // Structure: { groupId: { 'YYYY-MM-DD': { studentId: { attendance: true, grade: 5, comment: '' } } } }
        this.monthlyAssessments = {}; // Structure: { groupId: { 'YYYY-MM': { studentId: { examScore: 0, bonusPoints: 0, finalGrade: 0 } } } }
        this.settings = {
            institutionName: 'Learning Center',
            academicYear: '2024-2025',
            maxGrade: 5,
            bonusSystem: 'enabled',
            language: 'en' // Default language
        };
        this.studentWeeklyScoresChart = null; // New chart instance for student weekly scores
        
        this.translations = {
            en: {
                // Sidebar
                eduCrm: "EduCRM",
                dashboard: "Dashboard",
                students: "Students",
                groups: "Groups",
                journal: "Journal",
                reports: "Reports",
                settings: "Settings",

                // Header
                back: "Back",
                overview: "Learning Management System Overview",
                administrator: "Administrator",

                // Dashboard
                totalStudents: "Total Students",
                activeGroups: "Active Groups",
                averageAttendance: "Average Attendance",
                averageGrade: "Average Grade",
                weeklyActivity: "Weekly Activity",
                recentActivities: "Recent Activities",
                newsFeed: "News Feed",
                noRecentActivities: "No recent activities.",
                noImportantNotifications: "No important notifications.",
                justNow: "just now",
                minAgo: "min. ago",
                hrAgo: "hr. ago",
                dayAgo: "day ago",
                attention: "Attention:",
                missedLessons: "missed 2 consecutive lessons.",
                lastMissed: "Last missed:",
                birthdayToday: "Today is the birthday of",
                birthdayIn: "birthday in",
                days: "days",
                birthday: "birthday",

                // Students Section
                addStudent: "Add Student",
                searchStudents: "Search students...",
                allStudents: "All Students",
                active: "Active",
                archived: "Archived",
                noGroup: "No Group",
                activeStatus: "Active",
                archivedStatus: "Archived",
                edit: "Edit",
                delete: "Delete",
                archive: "Archive",
                confirmDeleteStudent: "Are you sure you want to delete this student?",
                studentEdited: "Student edited",
                studentNameChanged: "Student name changed from",
                to: "to",
                studentMoved: "Student",
                fromGroup: "from group",
                toGroup: "to",
                studentStatusChanged: "Student status",
                changedTo: "changed to",
                studentAvatarChanged: "Student profile photo changed",
                studentDataEdited: "Student data edited",
                newStudentAdded: "New student added",
                studentDeleted: "Student deleted",

                // Student Modal
                addStudentModalTitle: "Add Student",
                editStudentModalTitle: "Edit Student",
                name: "First Name",
                surname: "Last Name",
                dob: "Date of Birth",
                classLetter: "Class Letter",
                selectLetter: "Select letter",
                classNumber: "Class Number",
                selectNumber: "Select number",
                phone: "Phone",
                group: "Group",
                selectGroup: "Select group",
                status: "Status",
                profilePhoto: "Profile Photo",
                selectFile: "Choose File",
                cancel: "Cancel",
                save: "Save",

                // Groups Section
                createGroup: "Create Group",
                studentsCount: "Students",
                attendance: "Attendance",
                journalBtn: "Journal",
                studentsBtn: "Students",
                scheduleNotSet: "Schedule not set",
                confirmDeleteGroup: "Are you sure you want to delete this group? All students in this group will be unassigned.",
                groupDeleted: "Group deleted",
                groupEdited: "Group edited",
                groupNameChanged: "Group name changed from",
                groupDescriptionChanged: "Group description changed",
                groupColorChanged: "Group color changed",
                groupScheduleChanged: "Group schedule changed",
                groupAvatarChanged: "Group photo changed",
                groupDataEdited: "Group data edited",
                newGroupCreated: "New group created",

                // Group Modal
                createGroupModalTitle: "Create Group",
                editGroupModalTitle: "Edit Group",
                groupName: "Group Name",
                description: "Description",
                groupColor: "Group Color",
                groupPhoto: "Group Photo",
                schedule: "Schedule",
                monday: "Mon",
                tuesday: "Tue",
                wednesday: "Wed",
                thursday: "Thu",
                friday: "Fri",
                saturday: "Sat",
                sunday: "Sun",

                // Journal Section
                selectGroupJournal: "Select Group",
                month: "Month",
                week: "Week",
                monthDisplay: "September 2025", // This will be dynamically updated
                weekDisplay: "Week 1", // This will be dynamically updated
                averageStudentGrade: "Average Student Grade",
                monthlySummaryReport: "Monthly Summary Report",
                noScheduleForGroup: "Schedule for this group is not set.",
                noDataForWeek: "No data for this week.",
                student: "Student",
                bonuses: "Bonuses",
                total: "Total",
                noActiveStudentsInGroup: "No active students in this group to display monthly report.",
                gradesForLessons: "Scores for lessons:",
                examScores: "Exam scores:",
                bonusPoints: "Bonus points:",

                // Comment Modal
                addComment: "Add Comment",
                comment: "Comment",

                // Reports Section
                attendanceReport: "Attendance Report",
                attendanceReportDesc: "Detailed attendance statistics by groups and students",
                generate: "Generate",
                studentPerformance: "Student Performance",
                studentPerformanceDesc: "Analysis of grades and academic performance",
                groupActivity: "Group Activity",
                groupActivityDesc: "Overview of group activity and engagement",
                report: "Report",
                exportPdf: "Export PDF",
                close: "Close",
                reportOptions: "Report Options",
                allGroups: "All Groups",
                allStudentsReport: "All Students",
                startDate: "Start Date",
                endDate: "End Date",
                generateReport: "Generate Report",
                noDataForFilters: "No data to display for selected filters.",
                attendanceByStudents: "Attendance by Students",
                attended: "Attended",
                totalLessons: "Total Lessons",
                percentage: "Percentage",
                averageCourseAttendance: "Average Course Attendance",
                studentsWithGoodAttendance: "Students with good attendance",
                studentGrades: "Student Performance",
                averageGradeReport: "Average Grade",
                totalScores: "Total Scores",
                gradeCount: "Number of Grades",
                maxGrade: "Max. Grade",
                minGrade: "Min. Grade",
                averageCourseGrade: "Average Course Grade",
                studentsWithGoodGrades: "Students with good grades",
                groupActivityReport: "Group Activity",
                studentsInGroup: "Number of Students",
                lessonsPerWeek: "Lessons per Week",
                status: "Status",
                totalGroups: "Total Groups",
                activeGroupsReport: "Active Groups",
                studentsInGroups: "Students in Groups",

                // Settings Section
                generalSettings: "General Settings",
                institutionName: "Institution Name",
                academicYear: "Academic Year",
                gradingSystem: "Grading System",
                maxLessonScore: "Maximum Grade per Lesson",
                bonusSystem: "Bonus System",
                enabled: "Enabled",
                disabled: "Disabled",
                languageSettings: "Language Settings",
                interfaceLanguage: "Interface Language",
                russian: "Russian",
                english: "English",
                saved: "Saved!",

                // Student Analytics
                studentAnalytics: "Student Analytics",
                detailedPerformanceOverview: "Detailed Performance Overview",
                additionalInfo: "Additional Information",
                birthDate: "Date of Birth:",
                class: "Class:",
                attendanceAnalytics: "Attendance",
                missedLessonsAnalytics: "Missed Lessons",
                totalLessonsAnalytics: "Total Lessons",
                averageGradeAnalytics: "Average Grade",
                gradeDynamics: "Grade Dynamics",
                recentComments: "Recent Comments",
                scoresByWeeks: "Scores by Weeks",
                noCommentsForStudent: "No comments for this student.",
                noGroupAttached: "Student is not attached to a group.",
                noScheduleForStudentGroup: "Schedule for student's group is not set.",
                noLessonDataForMonth: "No lesson data for this month.",
                weekLabel: "Week",
                scores: "scores",
                grade: "Grade",
                date: "Date",
                totalScore: "Total Score",
                weeks: "Weeks",
                studentGrades: "Student Grades"
            },
            ru: {
                // Sidebar
                eduCrm: "EduCRM",
                dashboard: "Панель управления",
                students: "Студенты",
                groups: "Группы",
                journal: "Журнал",
                reports: "Отчеты",
                settings: "Настройки",

                // Header
                back: "Назад",
                overview: "Обзор системы управления обучением",
                administrator: "Администратор",

                // Dashboard
                totalStudents: "Всего студентов",
                activeGroups: "Активные группы",
                averageAttendance: "Средняя посещаемость",
                averageGrade: "Средняя оценка",
                weeklyActivity: "Еженедельная активность",
                recentActivities: "Последние действия",
                newsFeed: "Лента новостей",
                noRecentActivities: "Нет последних действий.",
                noImportantNotifications: "Нет важных уведомлений.",
                justNow: "только что",
                minAgo: "мин. назад",
                hrAgo: "ч. назад",
                dayAgo: "дн. назад",
                attention: "Внимание:",
                missedLessons: "пропустил(а) 2 занятия подряд.",
                lastMissed: "Последний пропуск:",
                birthdayToday: "Сегодня день рождения у",
                birthdayIn: "день рождения через",
                days: "дней",
                birthday: "день рождения",

                // Students Section
                addStudent: "Добавить студента",
                searchStudents: "Поиск студентов...",
                allStudents: "Все студенты",
                active: "Активные",
                archived: "Архивные",
                noGroup: "Без группы",
                activeStatus: "Активный",
                archivedStatus: "Архивный",
                edit: "Редактировать",
                delete: "Удалить",
                archive: "Архивировать",
                confirmDeleteStudent: "Вы уверены, что хотите удалить этого студента?",
                studentEdited: "Студент отредактирован",
                studentNameChanged: "Имя студента изменено с",
                to: "на",
                studentMoved: "Студент",
                fromGroup: "из группы",
                toGroup: "в группу",
                studentStatusChanged: "Статус студента",
                changedTo: "изменен на",
                studentAvatarChanged: "Фото профиля студента изменено",
                studentDataEdited: "Данные студента отредактированы",
                newStudentAdded: "Добавлен новый студент",
                studentDeleted: "Студент удален",

                // Student Modal
                addStudentModalTitle: "Добавить студента",
                editStudentModalTitle: "Редактировать студента",
                name: "Имя",
                surname: "Фамилия",
                dob: "Дата рождения",
                classLetter: "Буква класса",
                selectLetter: "Выберите букву",
                classNumber: "Номер класса",
                selectNumber: "Выберите номер",
                phone: "Телефон",
                group: "Группа",
                selectGroup: "Выберите группу",
                status: "Статус",
                profilePhoto: "Фото профиля",
                selectFile: "Выбрать файл",
                cancel: "Отмена",
                save: "Сохранить",

                // Groups Section
                createGroup: "Создать группу",
                studentsCount: "Студентов",
                attendance: "Посещаемость",
                journalBtn: "Журнал",
                studentsBtn: "Студенты",
                scheduleNotSet: "Расписание не установлено",
                confirmDeleteGroup: "Вы уверены, что хотите удалить эту группу? Все студенты в этой группе будут откреплены.",
                groupDeleted: "Группа удалена",
                groupEdited: "Группа отредактирована",
                groupNameChanged: "Название группы изменено с",
                groupDescriptionChanged: "Описание группы изменено",
                groupColorChanged: "Цвет группы изменен",
                groupScheduleChanged: "Расписание группы изменено",
                groupAvatarChanged: "Фото группы изменено",
                groupDataEdited: "Данные группы отредактированы",
                newGroupCreated: "Создана новая группа",

                // Group Modal
                createGroupModalTitle: "Создать группу",
                editGroupModalTitle: "Редактировать группу",
                groupName: "Название группы",
                description: "Описание",
                groupColor: "Цвет группы",
                groupPhoto: "Фото группы",
                schedule: "Расписание",
                monday: "Пн",
                tuesday: "Вт",
                wednesday: "Ср",
                thursday: "Чт",
                friday: "Пт",
                saturday: "Сб",
                sunday: "Вс",

                // Journal Section
                selectGroupJournal: "Выберите группу",
                month: "Месяц",
                week: "Неделя",
                monthDisplay: "Сентябрь 2025", // This will be dynamically updated
                weekDisplay: "Неделя 1", // This will be dynamically updated
                averageStudentGrade: "Средняя оценка студента",
                monthlySummaryReport: "Ежемесячный сводный отчет",
                noScheduleForGroup: "Расписание для этой группы не задано.",
                noDataForWeek: "Нет данных за эту неделю.",
                student: "Студент",
                bonuses: "Бонусы",
                total: "Итог",
                noActiveStudentsInGroup: "Нет активных студентов в этой группе для отображения ежемесячного отчета.",
                gradesForLessons: "Баллы за занятия:",
                examScores: "Баллы за экзамен:",
                bonusPoints: "Бонусные баллы:",

                // Comment Modal
                addComment: "Добавить комментарий",
                comment: "Комментарий",

                // Reports Section
                attendanceReport: "Отчет по посещаемости",
                attendanceReportDesc: "Подробная статистика посещаемости по группам и студентам",
                generate: "Сформировать",
                studentPerformance: "Успеваемость студентов",
                studentPerformanceDesc: "Анализ оценок и успеваемости",
                groupActivity: "Активность групп",
                groupActivityDesc: "Обзор активности и вовлеченности групп",
                report: "Отчет",
                exportPdf: "Экспорт в PDF",
                close: "Закрыть",
                reportOptions: "Параметры отчета",
                allGroups: "Все группы",
                allStudentsReport: "Все студенты",
                startDate: "Дата начала",
                endDate: "Дата окончания",
                generateReport: "Сформировать отчет",
                noDataForFilters: "Нет данных для отображения по выбранным фильтрам.",
                attendanceByStudents: "Посещаемость по студентам",
                attended: "Посещено",
                totalLessons: "Всего занятий",
                percentage: "Процент",
                averageCourseAttendance: "Средняя посещаемость по курсу",
                studentsWithGoodAttendance: "Студентов с хорошей посещаемостью",
                studentGrades: "Успеваемость студентов",
                averageGradeReport: "Средний балл",
                totalScores: "Сумма баллов",
                gradeCount: "Количество оценок",
                maxGrade: "Макс. оценка",
                minGrade: "Мин. оценка",
                averageCourseGrade: "Средний балл по курсу",
                studentsWithGoodGrades: "Студентов с хорошими оценками",
                groupActivityReport: "Активность групп",
                studentsInGroup: "Количество студентов",
                lessonsPerWeek: "Занятий в неделю",
                status: "Статус",
                totalGroups: "Всего групп",
                activeGroupsReport: "Активных групп",
                studentsInGroups: "Студентов в группах",

                // Settings Section
                generalSettings: "Общие настройки",
                institutionName: "Название учреждения",
                academicYear: "Учебный год",
                gradingSystem: "Система оценивания",
                maxLessonScore: "Максимальная оценка за занятие",
                bonusSystem: "Бонусная система",
                enabled: "Включена",
                disabled: "Отключена",
                languageSettings: "Настройки языка",
                interfaceLanguage: "Язык интерфейса",
                russian: "Русский",
                english: "Английский",
                saved: "Сохранено!",

                // Student Analytics
                studentAnalytics: "Аналитика студента",
                detailedPerformanceOverview: "Подробный обзор успеваемости",
                additionalInfo: "Дополнительная информация",
                birthDate: "Дата рождения:",
                class: "Класс:",
                attendanceAnalytics: "Посещаемость",
                missedLessonsAnalytics: "Пропущенные занятия",
                totalLessonsAnalytics: "Всего занятий",
                averageGradeAnalytics: "Средний балл",
                gradeDynamics: "Динамика оценок",
                recentComments: "Последние комментарии",
                scoresByWeeks: "Баллы по неделям",
                noCommentsForStudent: "Нет комментариев для этого студента.",
                noGroupAttached: "Студент не прикреплен к группе.",
                noScheduleForStudentGroup: "Расписание для группы студента не задано.",
                noLessonDataForMonth: "Нет данных о занятиях за этот месяц.",
                weekLabel: "Неделя",
                scores: "баллов",
                grade: "Оценка",
                date: "Дата",
                totalScore: "Итоговый балл",
                weeks: "Недели",
                studentGrades: "Оценки студента"
            }
        };
        
        this.init();
    }

    async init() {
        await this.initDB();
        await this.loadData();
        this.initEventListeners();
        this.initAnalyticsEventListeners(); // Initialize new event listeners for analytics
        this.setLanguage(this.settings.language, false); // Apply language on initialization
        this.renderCurrentSection();
        this.updateStats();
        this.applyTheme(); // Apply theme on initialization
        lucide.createIcons();
    }

    setLanguage(lang, save = true) {
        this.settings.language = lang;
        document.documentElement.lang = lang; // Update HTML lang attribute

        if (save) {
            this.saveToDB('settings', { key: 'language', value: lang });
        }

        // Update all text content on the page
        this.updateTextContent();
        this.renderCurrentSection(); // Re-render current section to apply new language
        this.updateStats(); // Update stats with new language
        this.updateMonthDisplay(); // Update month display with new language
        this.updateWeekDisplay(); // Update week display with new language
        this.renderStudentAnalytics(); // Re-render student analytics
        lucide.createIcons(); // Re-create icons to ensure any text within them is updated
    }

    updateTextContent() {
        const lang = this.settings.language;
        const t = this.translations[lang];

        // Sidebar
        // Sidebar
        let element = document.querySelector('.sidebar-header h2');
        if (element) element.textContent = t.eduCrm;
        element = document.querySelector('.nav-item[data-section="dashboard"] span');
        if (element) element.textContent = t.dashboard;
        element = document.querySelector('.nav-item[data-section="students"] span');
        if (element) element.textContent = t.students;
        element = document.querySelector('.nav-item[data-section="groups"] span');
        if (element) element.textContent = t.groups;
        element = document.querySelector('.nav-item[data-section="journal"] span');
        if (element) element.textContent = t.journal;
        element = document.querySelector('.nav-item[data-section="reports"] span');
        if (element) element.textContent = t.reports;
        element = document.querySelector('.nav-item[data-section="settings"] span');
        if (element) element.textContent = t.settings;

        // Header
        element = document.querySelector('.back-button span');
        if (element) element.textContent = t.back;
        element = document.querySelector('.user-info span');
        if (element) element.textContent = t.administrator;

        // Dashboard
        element = document.querySelector('#total-students + p');
        if (element) element.textContent = t.totalStudents;
        element = document.querySelector('#active-groups + p');
        if (element) element.textContent = t.activeGroups;
        element = document.querySelector('#attendance-rate + p');
        if (element) element.textContent = t.averageAttendance;
        element = document.querySelector('#average-grade + p');
        if (element) element.textContent = t.averageGrade;
        element = document.querySelector('.dashboard-content .chart-container h3');
        if (element) element.textContent = t.weeklyActivity;
        element = document.querySelector('.dashboard-content .activity-container h3');
        if (element) element.textContent = t.recentActivities;
        element = document.querySelector('.dashboard-content .news-feed-container h3');
        if (element) element.textContent = t.newsFeed;

        // Students Section
        element = document.getElementById('add-student-btn')?.querySelector('span');
        if (element) element.textContent = t.addStudent;
        element = document.getElementById('student-search');
        if (element) element.setAttribute('placeholder', t.searchStudents);
        element = document.querySelector('#student-filter option[value="all"]');
        if (element) element.textContent = t.allStudents;
        element = document.querySelector('#student-filter option[value="active"]');
        if (element) element.textContent = t.active;
        element = document.querySelector('#student-filter option[value="archived"]');
        if (element) element.textContent = t.archived;

        // Groups Section
        element = document.getElementById('add-group-btn')?.querySelector('span');
        if (element) element.textContent = t.createGroup;

        // Journal Section
        element = document.querySelector('#group-select option[value=""]');
        if (element) element.textContent = t.selectGroupJournal;
        element = document.getElementById('toggle-view-btn');
        if (element) element.textContent = this.currentJournalView === 'week' ? t.month : t.week;
        element = document.querySelector('#weekly-journal-view .chart-container h3');
        if (element) element.textContent = t.averageStudentGrade;
        element = document.querySelector('#monthly-summary-view h3');
        if (element) element.textContent = t.monthlySummaryReport;

        // Reports Section
        element = document.querySelector('.report-card:nth-child(1) h3');
        if (element) element.textContent = t.attendanceReport;
        element = document.querySelector('.report-card:nth-child(1) p');
        if (element) element.textContent = t.attendanceReportDesc;
        element = document.querySelector('.report-card:nth-child(1) button');
        if (element) element.textContent = t.generate;
        element = document.querySelector('.report-card:nth-child(2) h3');
        if (element) element.textContent = t.studentPerformance;
        element = document.querySelector('.report-card:nth-child(2) p');
        if (element) element.textContent = t.studentPerformanceDesc;
        element = document.querySelector('.report-card:nth-child(2) button');
        if (element) element.textContent = t.generate;
        element = document.querySelector('.report-card:nth-child(3) h3');
        if (element) element.textContent = t.groupActivity;
        element = document.querySelector('.report-card:nth-child(3) p');
        if (element) element.textContent = t.groupActivityDesc;
        element = document.querySelector('.report-card:nth-child(3) button');
        if (element) element.textContent = t.generate;

        // Settings Section
        element = document.querySelector('#settings .settings-group:nth-child(1) h3');
        if (element) element.textContent = t.generalSettings;
        element = document.querySelector('label[for="institution-name"]');
        if (element) element.textContent = t.institutionName;
        element = document.querySelector('label[for="academic-year"]');
        if (element) element.textContent = t.academicYear;
        element = document.querySelector('#settings .settings-group:nth-child(2) h3');
        if (element) element.textContent = t.gradingSystem;
        element = document.querySelector('label[for="max-grade"]');
        if (element) element.textContent = t.maxLessonScore;
        element = document.querySelector('label[for="bonus-system"]');
        if (element) element.textContent = t.bonusSystem;
        element = document.querySelector('#bonus-system option[value="enabled"]');
        if (element) element.textContent = t.enabled;
        element = document.querySelector('#bonus-system option[value="disabled"]');
        if (element) element.textContent = t.disabled;
        element = document.querySelector('#settings .settings-group:nth-child(3) h3');
        if (element) element.textContent = t.languageSettings;
        element = document.querySelector('label[for="language-select"]');
        if (element) element.textContent = t.interfaceLanguage;
        element = document.querySelector('#language-select option[value="ru"]');
        if (element) element.textContent = t.russian;
        element = document.querySelector('#language-select option[value="en"]');
        if (element) element.textContent = t.english;
        element = document.getElementById('save-settings');
        if (element) element.textContent = t.save;

        // Modals (titles and common buttons)
        element = document.querySelector('#student-modal .modal-cancel');
        if (element) element.textContent = t.cancel;
        element = document.querySelector('#student-modal button[type="submit"]');
        if (element) element.textContent = t.save;
        element = document.querySelector('#group-modal .modal-cancel');
        if (element) element.textContent = t.cancel;
        element = document.querySelector('#group-modal button[type="submit"]');
        if (element) element.textContent = t.save;
        element = document.querySelector('#comment-modal .modal-cancel');
        if (element) element.textContent = t.cancel;
        element = document.querySelector('#comment-modal button[type="submit"]');
        if (element) element.textContent = t.save;
        element = document.querySelector('#report-modal .modal-cancel');
        if (element) element.textContent = t.close;
        element = document.getElementById('export-report');
        if (element) element.textContent = t.exportPdf;
        element = document.querySelector('#report-options-modal .modal-cancel');
        if (element) element.textContent = t.cancel;
        element = document.getElementById('generate-filtered-report-btn');
        if (element) element.textContent = t.generateReport;

        // Student Modal specific labels
        element = document.querySelector('#student-form label[for="student-name"]');
        if (element) element.textContent = t.name + ' *';
        element = document.querySelector('#student-form label[for="student-surname"]');
        if (element) element.textContent = t.surname + ' *';
        element = document.querySelector('#student-form label[for="student-dob"]');
        if (element) element.textContent = t.dob;
        element = document.querySelector('#student-form label[for="student-class-letter"]');
        if (element) element.textContent = t.classLetter;
        element = document.querySelector('#student-form #student-class-letter option[value=""]');
        if (element) element.textContent = t.selectLetter;
        element = document.querySelector('#student-form label[for="student-class-number"]');
        if (element) element.textContent = t.classNumber;
        element = document.querySelector('#student-form #student-class-number option[value=""]');
        if (element) element.textContent = t.selectNumber;
        element = document.querySelector('#student-form label[for="student-phone"]');
        if (element) element.textContent = t.phone;
        element = document.querySelector('#student-form label[for="student-group"]');
        if (element) element.textContent = t.group;
        element = document.querySelector('#student-form #student-group option[value=""]');
        if (element) element.textContent = t.selectGroup;
        element = document.querySelector('#student-form label[for="student-status"]');
        if (element) element.textContent = t.status;
        element = document.querySelector('#student-form #student-status option[value="active"]');
        if (element) element.textContent = t.activeStatus;
        element = document.querySelector('#student-form #student-status option[value="archived"]');
        if (element) element.textContent = t.archivedStatus;
        element = document.querySelector('#student-form label[for="student-avatar-upload"]');
        if (element) element.textContent = t.profilePhoto;
        element = document.querySelector('#student-form .avatar-upload-label span');
        if (element) element.textContent = t.selectFile;

        // Group Modal specific labels
        element = document.querySelector('#group-form label[for="group-name"]');
        if (element) element.textContent = t.groupName + ' *';
        element = document.querySelector('#group-form label[for="group-description"]');
        if (element) element.textContent = t.description;
        element = document.querySelector('#group-form label[for="group-color"]');
        if (element) element.textContent = t.groupColor;
        element = document.querySelector('#group-form label[for="group-avatar-upload"]');
        if (element) element.textContent = t.groupPhoto;
        element = document.querySelector('#group-form .avatar-upload-label span');
        if (element) element.textContent = t.selectFile;
        element = document.querySelector('#group-form label:has(#monday)');
        if (element) element.textContent = t.monday;
        element = document.querySelector('#group-form label:has(#tuesday)');
        if (element) element.textContent = t.tuesday;
        element = document.querySelector('#group-form label:has(#wednesday)');
        if (element) element.textContent = t.wednesday;
        element = document.querySelector('#group-form label:has(#thursday)');
        if (element) element.textContent = t.thursday;
        element = document.querySelector('#group-form label:has(#friday)');
        if (element) element.textContent = t.friday;
        element = document.querySelector('#group-form label:has(#saturday)');
        if (element) element.textContent = t.saturday;
        element = document.querySelector('#group-form label:has(#sunday)');
        if (element) element.textContent = t.sunday;
        element = document.querySelector('#group-form .form-group label');
        if (element) element.textContent = t.schedule;

        // Report Options Modal specific labels
        element = document.querySelector('#report-options-modal-title');
        if (element) element.textContent = t.reportOptions;
        element = document.querySelector('#report-group-select option[value="all"]');
        if (element) element.textContent = t.allGroups;
        element = document.querySelector('#report-student-select option[value="all"]');
        if (element) element.textContent = t.allStudentsReport;
        element = document.querySelector('label[for="report-group-select"]');
        if (element) element.textContent = t.group;
        element = document.querySelector('label[for="report-student-select"]');
        if (element) element.textContent = t.student;
        element = document.querySelector('label[for="report-start-date"]');
        if (element) element.textContent = t.startDate;
        element = document.querySelector('label[for="report-end-date"]');
        if (element) element.textContent = t.endDate;

        // Student Analytics
        element = document.querySelector('#student-analytics .analytics-profile-column .student-profile-card:nth-child(2) h3');
        if (element) element.textContent = t.additionalInfo;
        element = document.querySelector('#student-analytics .analytics-stats-grid .stat-card:nth-child(1) p');
        if (element) element.textContent = t.attendanceAnalytics;
        element = document.querySelector('#student-analytics .analytics-stats-grid .stat-card:nth-child(2) p');
        if (element) element.textContent = t.missedLessonsAnalytics;
        element = document.querySelector('#student-analytics .analytics-stats-grid .stat-card:nth-child(3) p');
        if (element) element.textContent = t.totalLessonsAnalytics;
        element = document.querySelector('#student-analytics .analytics-stats-grid .stat-card:nth-child(4) p');
        if (element) element.textContent = t.averageGradeAnalytics;
        element = document.querySelector('#student-analytics .analytics-section-card:nth-child(1) h3');
        if (element) element.textContent = t.gradeDynamics;
        element = document.querySelector('#student-analytics .analytics-grid-2-col .analytics-section-card:nth-child(1) h3');
        if (element) element.textContent = t.recentComments;
        element = document.querySelector('#student-analytics .analytics-grid-2-col .analytics-section-card:nth-child(2) h3');
        if (element) element.textContent = t.scoresByWeeks;
    }

    // IndexedDB functions
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EduCRM', 3); // Increment database version
            
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
                if (!db.objectStoreNames.contains('activities')) {
                    const activitiesStore = db.createObjectStore('activities', { keyPath: 'id' });
                    activitiesStore.createIndex('time', 'time', { unique: false });
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

    async logActivity(icon, iconClass, text) {
        const activity = {
            id: Date.now().toString(),
            icon,
            iconClass,
            text,
            time: new Date().toISOString()
        };
        await this.saveToDB('activities', activity);
        if (this.currentSection === 'dashboard') {
            this.renderRecentActivities();
        }
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
                name: 'Group A-101',
                description: 'Basic Programming Course',
                color: '#2563eb',
                schedule: {
                    monday: '09:00',
                    wednesday: '09:00',
                    friday: '09:00'
                }
            },
            {
                id: '2',
                name: 'Group B-202',
                description: 'Advanced Web Development Course',
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
                name: 'John',
                surname: 'Doe',
                dob: '2010-05-15',
                classLetter: 'А',
                classNumber: '7',
                phone: '+7 999 123-45-67',
                group: '1',
                status: 'active'
            },
            {
                id: '2',
                name: 'Jane',
                surname: 'Smith',
                dob: '2011-03-20',
                classLetter: 'Б',
                classNumber: '6',
                phone: '+7 999 234-56-78',
                group: '1',
                status: 'active'
            },
            {
                id: '3',
                name: 'Alex',
                surname: 'Johnson',
                dob: '2009-11-01',
                classLetter: 'В',
                classNumber: '8',
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
        document.getElementById('language-select').addEventListener('change', (e) => this.setLanguage(e.target.value));

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

        // Avatar upload previews
        document.getElementById('student-avatar-upload').addEventListener('change', (e) => this.previewAvatar(e, 'student-avatar-preview'));
        document.getElementById('group-avatar-upload').addEventListener('change', (e) => this.previewAvatar(e, 'group-avatar-preview'));
    }

    previewAvatar(event, previewElementId) {
        const file = event.target.files[0];
        const preview = document.getElementById(previewElementId);
        preview.innerHTML = ''; // Clear previous preview

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
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
        const t = this.translations[this.settings.language]; // Define t for translations
        const titles = {
            dashboard: [t.dashboard, t.overview],
            students: [t.students, 'Student Management'],
            groups: [t.groups, 'Group Management'],
            journal: [t.journal, 'Attendance and Grade Journal'],
            reports: [t.reports, 'Report Generation'],
            settings: [t.settings, 'System Settings'],
            'student-analytics': [t.studentAnalytics, t.detailedPerformanceOverview] // Add title for student analytics
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
        this.renderNewsFeed();
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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of today

        for (const groupId in this.journal) {
            const group = this.groups.find(g => g.id === groupId);
            if (!group || !group.schedule) continue;

            for (const dateKey in this.journal[groupId]) {
                const entryDate = new Date(dateKey);
                entryDate.setHours(0, 0, 0, 0); // Normalize to start of day

                // Only consider entries up to the current system date
                if (entryDate > today) {
                    continue;
                }

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

    calculateStudentAttendance(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student || !student.group) {
            return { attendedSessions: 0, totalScheduledSessions: 0 };
        }

        const group = this.groups.find(g => g.id === student.group);
        if (!group || !group.schedule) {
            return { attendedSessions: 0, totalScheduledSessions: 0 };
        }

        let attendedSessions = 0;
        let totalScheduledSessions = 0;
        const studentJournal = this.journal[student.group] || {};

        // Determine the date range for calculation based on the group's journal entries
        let earliestJournalDate = null;
        const groupJournal = this.journal[student.group] || {};
        for (const dateKey in groupJournal) {
            const entryDate = new Date(dateKey);
            if (!earliestJournalDate || entryDate < earliestJournalDate) {
                earliestJournalDate = entryDate;
            }
        }

        // If there are no journal entries for the group, use a default start date (e.g., 30 days ago)
        // Otherwise, use the earliest journal date for the group.
        const startDate = earliestJournalDate || (() => {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            return d;
        })();
        startDate.setHours(0, 0, 0, 0); // Normalize to start of day

        const today = new Date();
        today.setHours(23, 59, 59, 999); // Normalize to end of today

        const endDate = today; // Up to today

        // Calculate total scheduled sessions based on group schedule within the date range
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1; // Monday is 0, Sunday is 6
            const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];

            if (group.schedule[dayName]) { // If a lesson is scheduled for this day
                totalScheduledSessions++;
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        // Count attended sessions from actual journal entries for this specific student
        for (const dateKey in studentJournal) {
            const entryDate = new Date(dateKey);
            entryDate.setHours(0, 0, 0, 0); // Normalize to start of day

            // Only count entries within the calculated range (up to today)
            if (entryDate >= startDate && entryDate <= today) {
                const studentDayData = studentJournal[dateKey][student.id];
                if (studentDayData && studentDayData.attendance) {
                    attendedSessions++;
                }
            }
        }
        
        return { attendedSessions, totalScheduledSessions };
    }

    renderWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Activity',
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

    async renderRecentActivities() {
        const allActivities = await this.getFromDB('activities') || [];
        // Sort by time descending to get the most recent
        allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
        const activities = allActivities.slice(0, 5); // Get last 5 activities


        const container = document.getElementById('recent-activities');
        if (!container) return;

        const t = this.translations[this.settings.language]; // Define t here

        if (activities.length === 0) {
            container.innerHTML = `<p>${t.noRecentActivities}</p>`;
            return;
        }

        container.innerHTML = activities.map(activity => {
            const timeAgo = this.formatTimeAgo(activity.time);
            return `
            <div class="activity-item">
                <div class="activity-icon ${activity.iconClass}">
                    <i data-lucide="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `}).join('');

        lucide.createIcons();
    }

    async renderNewsFeed() {
        const t = this.translations[this.settings.language];
        const newsFeedContainer = document.getElementById('news-feed');
        if (!newsFeedContainer) return;

        const newsItems = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today for comparison

        // Check for attendance warnings
        for (const student of this.students.filter(s => s.status === 'active' && s.group)) {
            const group = this.groups.find(g => g.id === student.group);
            if (!group || !group.schedule) continue;

            const studentJournal = this.journal[student.group] || {};
            const dates = Object.keys(studentJournal).sort(); // Sort dates chronologically

            let consecutiveAbsences = 0;
            let lastAbsenceDate = null;

            for (const dateKey of dates) {
                const entryDate = new Date(dateKey);
                if (entryDate >= today) continue; // Only check past dates

                const dayOfWeek = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
                const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];

                // Check if there was a scheduled lesson on this day
                if (group.schedule[dayName]) {
                    const studentDayData = studentJournal[dateKey][student.id];
                    // An absence is considered if attendance is explicitly false, or if there's no record for a scheduled day
                    if (!studentDayData || studentDayData.attendance === false) {
                        consecutiveAbsences++;
                        lastAbsenceDate = entryDate;
                    } else {
                        // Reset only if attendance is true
                        if (studentDayData && studentDayData.attendance === true) {
                           consecutiveAbsences = 0;
                        }
                    }

                    if (consecutiveAbsences >= 2) {
                        newsItems.push({
                            type: 'warning',
                            icon: 'alert-triangle',
                            iconClass: 'orange',
            text: `<strong>${t.attention}</strong> ${student.name} ${student.surname} ${t.missedLessons} ${t.lastMissed} ${lastAbsenceDate.toLocaleDateString('en-US')}`
                        });
                        // Reset after finding a warning for this student to avoid multiple warnings for the same streak
                        consecutiveAbsences = 0;
                    }
                }
            }
        }

        // Check for upcoming birthdays
        const fourDaysFromNow = new Date();
        fourDaysFromNow.setDate(today.getDate() + 4);
        fourDaysFromNow.setHours(23, 59, 59, 999); // End of the 4th day

        for (const student of this.students.filter(s => s.status === 'active')) {
            if (!student.dob) continue;

            const dob = new Date(student.dob);
            const studentBirthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
            
            // If birthday already passed this year, check for next year
            if (studentBirthdayThisYear < today) {
                studentBirthdayThisYear.setFullYear(today.getFullYear() + 1);
            }

            // Check if birthday is within the next 4 days (inclusive of today)
            if (studentBirthdayThisYear >= today && studentBirthdayThisYear <= fourDaysFromNow) {
                const daysUntilBirthday = Math.ceil((studentBirthdayThisYear - today) / (1000 * 60 * 60 * 24));
                let birthdayText = '';
                if (daysUntilBirthday === 0) {
                    birthdayText = `${t.birthdayToday} ${student.name} ${student.surname}! 🎉`;
                } else {
                    birthdayText = `${student.name} ${student.surname} ${t.birthdayIn} ${daysUntilBirthday} ${t.days} (${studentBirthdayThisYear.toLocaleDateString('en-US')})! 🎂`;
                }
                newsItems.push({
                    type: 'birthday',
                    icon: 'cake',
                    iconClass: 'purple',
                    text: birthdayText
                });
            }
        }

        if (newsItems.length === 0) {
            newsFeedContainer.innerHTML = `<p>${t.noImportantNotifications}</p>`;
            return;
        }

        newsFeedContainer.innerHTML = newsItems.map(item => `
            <div class="activity-item news-item ${item.type === 'warning' ? 'warning' : ''}">
                <div class="activity-icon ${item.iconClass}">
                    <i data-lucide="${item.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${item.text}</p>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    formatTimeAgo(isoString) {
        const t = this.translations[this.settings.language];
        const date = new Date(isoString);
        const now = new Date();
        const seconds = Math.round((now - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return t.justNow;
        if (minutes < 60) return `${minutes} ${t.minAgo}`;
        if (hours < 24) return `${hours} ${t.hrAgo}`;
        return `${days} ${t.dayAgo}`;
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
        const t = this.translations[this.settings.language];
        const grid = document.getElementById('students-grid');
        if (!grid) return;

        grid.innerHTML = students.map(student => {
            const group = this.groups.find(g => g.id === student.group);
            const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
            const avatarColor = student.avatarColor || this.getRandomColor(); // Use existing color or generate new
            // Store the generated color if it's new, so it persists across renders
            // Store the generated color if it's new, so it persists across renders
            // This logic is now less critical as avatar will take precedence, but kept for consistency
            if (!student.avatarColor && !student.avatar) {
                student.avatarColor = avatarColor;
                this.saveToDB('students', student); // Persist the color
            }

            const avatarHtml = student.avatar 
                ? `<img src="${student.avatar}" alt="Student Avatar" class="student-avatar-img">`
                : `<div class="student-avatar" style="background: ${avatarColor}; color: white;">${initials}</div>`;

            return `
                <div class="student-card animate-fade-in">
                    <div class="student-header">
                        ${avatarHtml}
                        <div class="student-actions">
                            <button class="action-btn edit" onclick="app.editStudent('${student.id}')">
                                <i data-lucide="edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="app.deleteStudent('${student.id}')">
                                <i data-lucide="trash-2"></i>
                            </button>
                            <button class="action-btn archive" onclick="app.toggleStudentStatus('${student.id}')">
                                <i data-lucide="archive"></i>
                            </button>
                        </div>
                    </div>
                    <div class="student-name" onclick="app.showStudentAnalytics('${student.id}')">${student.name} ${student.surname}</div>
                    <div class="student-group">${group ? group.name : t.noGroup} ${student.classNumber ? `(${student.classNumber}${student.classLetter})` : ''}</div>
                    <div class="student-contact">
                        ${student.dob ? `
                            <div class="contact-item">
                                <i data-lucide="calendar"></i>
                                <span>${new Date(student.dob).toLocaleDateString('en-US')}</span>
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
                        ${student.status === 'active' ? t.activeStatus : t.archivedStatus}
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    filterStudents(searchTerm) {
        const filtered = this.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.surname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayStudents(filtered);
    }

    filterStudentsByStatus(status) {
        const filtered = status === 'all' ? this.students : this.students.filter(s => s.status === status);
        this.displayStudents(filtered);
    }

    openStudentModal(studentId = null) {
        const t = this.translations[this.settings.language];
        this.currentStudentId = studentId;
        const modal = document.getElementById('student-modal');
        const title = document.getElementById('student-modal-title');
        const form = document.getElementById('student-form');

        if (studentId) {
            const student = this.students.find(s => s.id === studentId);
            title.textContent = t.editStudentModalTitle;
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-surname').value = student.surname;
            document.getElementById('student-dob').value = student.dob || '';
            document.getElementById('student-class-letter').value = student.classLetter || '';
            document.getElementById('student-class-number').value = student.classNumber || '';
            document.getElementById('student-phone').value = student.phone || '';
            document.getElementById('student-group').value = student.group || '';
            document.getElementById('student-status').value = student.status;

            const studentAvatarPreview = document.getElementById('student-avatar-preview');
            studentAvatarPreview.innerHTML = ''; // Clear previous preview
            if (student.avatar) {
                const img = document.createElement('img');
                img.src = student.avatar;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                studentAvatarPreview.appendChild(img);
            }
        } else {
            title.textContent = t.addStudentModalTitle;
            form.reset();
            document.getElementById('student-avatar-preview').innerHTML = ''; // Clear preview on new student
        }

        this.showModal(modal);
    }

    async saveStudent(e) {
        e.preventDefault();
        const t = this.translations[this.settings.language];
        
        const studentData = {
            id: this.currentStudentId || Date.now().toString(),
            name: document.getElementById('student-name').value,
            surname: document.getElementById('student-surname').value,
            dob: document.getElementById('student-dob').value,
            classLetter: document.getElementById('student-class-letter').value,
            classNumber: document.getElementById('student-class-number').value,
            phone: document.getElementById('student-phone').value,
            group: document.getElementById('student-group').value,
            status: document.getElementById('student-status').value,
            avatar: null // Will be set below
        };

        const avatarFile = document.getElementById('student-avatar-upload').files[0];
        if (avatarFile) {
            studentData.avatar = await this.fileToBase64(avatarFile);
        } else if (!this.currentStudentId) { // Only generate if new student and no file uploaded
            studentData.avatar = this.generateDefaultAvatar(studentData.name, studentData.surname);
        } else { // If editing existing student, keep existing avatar if no new one uploaded
            const existingStudent = this.students.find(s => s.id === this.currentStudentId);
            if (existingStudent) {
                studentData.avatar = existingStudent.avatar;
            }
        }

        let activityText = '';
        let activityIcon = 'user-plus';
        let activityIconClass = 'blue';

        if (this.currentStudentId) {
            const existingStudentIndex = this.students.findIndex(s => s.id === this.currentStudentId);
            const existingStudent = { ...this.students[existingStudentIndex] }; // Clone to compare

            this.students[existingStudentIndex] = { ...existingStudent, ...studentData }; // Merge existing with new data
            activityText = `${t.studentEdited} ${studentData.name} ${studentData.surname}`;
            activityIcon = 'edit';
            activityIconClass = 'orange';

            // More specific change detection
            if (existingStudent.name !== studentData.name || existingStudent.surname !== studentData.surname) {
                activityText = `${t.studentNameChanged} "${existingStudent.name} ${existingStudent.surname}" ${t.to} "${studentData.name} ${studentData.surname}"`;
            } else if (existingStudent.group !== studentData.group) {
                const oldGroup = this.groups.find(g => g.id === existingStudent.group)?.name || t.noGroup;
                const newGroup = this.groups.find(g => g.id === studentData.group)?.name || t.noGroup;
                activityText = `${t.studentMoved} ${studentData.name} ${studentData.surname} ${t.fromGroup} "${oldGroup}" ${t.toGroup} "${newGroup}"`;
                activityIcon = 'users-2';
                activityIconClass = 'green';
            } else if (existingStudent.status !== studentData.status) {
                activityText = `${t.studentStatusChanged} ${studentData.name} ${studentData.surname} ${t.changedTo} "${studentData.status === 'active' ? t.activeStatus : t.archivedStatus}"`;
                activityIcon = 'archive';
                activityIconClass = 'purple';
            } else if (existingStudent.avatar !== studentData.avatar) {
                activityText = `${t.studentAvatarChanged} ${studentData.name} ${studentData.surname}`;
                activityIcon = 'image';
                activityIconClass = 'blue';
            } else {
                activityText = `${t.studentDataEdited} ${studentData.name} ${studentData.surname}`;
            }

        } else {
            this.students.push(studentData);
            activityText = `${t.newStudentAdded} ${studentData.name} ${studentData.surname}`;
        }

        await this.saveToDB('students', studentData);
        this.renderStudents();
        this.updateStats();
        this.closeModal();
        this.currentStudentId = null;
        this.logActivity(activityIcon, activityIconClass, activityText);
    }

    editStudent(id) {
        this.openStudentModal(id);
    }

    async deleteStudent(id) {
        const t = this.translations[this.settings.language];
        if (!confirm(t.confirmDeleteStudent)) {
            return;
        }
        const student = this.students.find(s => s.id === id);
        this.students = this.students.filter(s => s.id !== id);
        await this.deleteFromDB('students', id);
        this.renderStudents();
        this.updateStats();
        this.logActivity('trash-2', 'danger', `${t.studentDeleted} ${student.name} ${student.surname}`);
    }

    async toggleStudentStatus(id) {
        const t = this.translations[this.settings.language];
        const student = this.students.find(s => s.id === id);
        student.status = student.status === 'active' ? 'archived' : 'active';
        
        await this.saveToDB('students', student);
        this.renderStudents();
        this.updateStats();
        this.logActivity('archive', 'orange', `${t.studentStatusChanged} ${student.name} ${student.surname} ${t.changedTo} "${student.status === 'active' ? t.activeStatus : t.archivedStatus}"`);
    }

    // Groups
    renderGroups() {
        this.displayGroups();
        this.populateJournalGroupSelect();
    }

    displayGroups() {
        const t = this.translations[this.settings.language];
        const grid = document.getElementById('groups-grid');
        if (!grid) return;

        grid.innerHTML = this.groups.map(group => {
            const studentsCount = this.students.filter(s => s.group === group.id && s.status === 'active').length;
            const scheduleText = this.formatSchedule(group.schedule);
            const initials = group.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

            const avatarHtml = group.avatar
                ? `<img src="${group.avatar}" alt="Group Avatar" class="group-avatar-img">`
                : `<div class="group-avatar" style="background: ${group.color}; color: white;">${initials}</div>`;

            return `
                <div class="group-card animate-fade-in">
                    <div class="group-header">
                        <div class="group-info">
                            ${avatarHtml}
                            <div class="group-details">
                                <h3>${group.name}</h3>
                                <div class="group-schedule">${scheduleText}</div>
                            </div>
                        </div>
                        <div class="group-actions-header">
                            <button class="action-btn edit" onclick="app.editGroup('${group.id}')">
                                <i data-lucide="edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="app.deleteGroup('${group.id}')">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                    <div class="group-stats">
                        <div class="stat-item">
                            <div class="value">${studentsCount}</div>
                            <div class="label">${t.studentsCount}</div>
                        </div>
                        <div class="stat-item">
                            <div class="value">92%</div>
                            <div class="label">${t.attendance}</div>
                        </div>
                    </div>
                    <div class="group-actions">
                        <button class="btn btn-secondary btn-small" onclick="app.openJournalForGroup('${group.id}')">
                            ${t.journalBtn}
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="app.showGroupStudents('${group.id}')">
                            ${t.studentsBtn}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    formatSchedule(schedule) {
        const t = this.translations[this.settings.language];
        const days = {
            monday: t.monday,
            tuesday: t.tuesday,
            wednesday: t.wednesday,
            thursday: t.thursday,
            friday: t.friday,
            saturday: t.saturday,
            sunday: t.sunday
        };

        const activeDays = Object.keys(schedule).filter(day => schedule[day]);
        return activeDays.map(day => `${days[day]} ${schedule[day]}`).join(', ') || t.scheduleNotSet;
    }

    openGroupModal(groupId = null) {
        const t = this.translations[this.settings.language];
        this.currentGroupId = groupId;
        const modal = document.getElementById('group-modal');
        const title = document.getElementById('group-modal-title');
        const form = document.getElementById('group-form');
        const groupAvatarPreview = document.getElementById('group-avatar-preview');
        groupAvatarPreview.innerHTML = ''; // Clear preview

        if (groupId) {
            const group = this.groups.find(g => g.id === groupId);
            title.textContent = t.editGroupModalTitle;
            document.getElementById('group-name').value = group.name;
            document.getElementById('group-description').value = group.description || '';
            document.getElementById('group-color').value = group.color;

            if (group.avatar) {
                const img = document.createElement('img');
                img.src = group.avatar;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                groupAvatarPreview.appendChild(img);
            }
            
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
            title.textContent = t.createGroupModalTitle;
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
        const t = this.translations[this.settings.language];
        
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
            schedule: schedule,
            avatar: null // Will be set below
        };

        const avatarFile = document.getElementById('group-avatar-upload').files[0];
        if (avatarFile) {
            groupData.avatar = await this.fileToBase64(avatarFile);
        } else if (!this.currentGroupId) { // Only generate if new group and no file uploaded
            groupData.avatar = this.generateDefaultAvatar(groupData.name);
        } else { // If editing existing group, keep existing avatar if no new one uploaded
            const existingGroup = this.groups.find(g => g.id === this.currentGroupId);
            if (existingGroup) {
                groupData.avatar = existingGroup.avatar;
            }
        }

        let activityText = '';
        let activityIcon = 'users-2';
        let activityIconClass = 'green';

        if (this.currentGroupId) {
            const existingGroupIndex = this.groups.findIndex(g => g.id === this.currentGroupId);
            const existingGroup = { ...this.groups[existingGroupIndex] }; // Clone to compare

            this.groups[existingGroupIndex] = { ...existingGroup, ...groupData };
            activityText = `${t.groupEdited} ${groupData.name}`;
            activityIcon = 'edit';
            activityIconClass = 'orange';

            // More specific change detection
            if (existingGroup.name !== groupData.name) {
                activityText = `${t.groupNameChanged} "${existingGroup.name}" ${t.to} "${groupData.name}"`;
            } else if (existingGroup.description !== groupData.description) {
                activityText = `${t.groupDescriptionChanged} ${groupData.name}`;
            } else if (existingGroup.color !== groupData.color) {
                activityText = `${t.groupColorChanged} ${groupData.name}`;
                activityIcon = 'palette';
                activityIconClass = 'purple';
            } else if (JSON.stringify(existingGroup.schedule) !== JSON.stringify(groupData.schedule)) {
                activityText = `${t.groupScheduleChanged} ${groupData.name}`;
                activityIcon = 'calendar';
                activityIconClass = 'blue';
            } else if (existingGroup.avatar !== groupData.avatar) {
                activityText = `${t.groupAvatarChanged} ${groupData.name}`;
                activityIcon = 'image';
                activityIconClass = 'blue';
            } else {
                activityText = `${t.groupDataEdited} ${groupData.name}`;
            }

        } else {
            this.groups.push(groupData);
            activityText = `${t.newGroupCreated} ${groupData.name}`;
        }

        await this.saveToDB('groups', groupData);
        this.renderGroups();
        this.updateStats();
        this.closeModal();
        this.currentGroupId = null;
        this.logActivity(activityIcon, activityIconClass, activityText);
    }

    editGroup(id) {
        this.openGroupModal(id);
    }

    async deleteGroup(id) {
        const t = this.translations[this.settings.language];
        if (!confirm(t.confirmDeleteGroup)) {
            return;
        }

        // Unassign students from this group
        this.students.forEach(student => {
            if (student.group === id) {
                student.group = ''; // Set group to empty string
                this.saveToDB('students', student); // Save updated student
            }
        });

        const group = this.groups.find(g => g.id === id);
        this.groups = this.groups.filter(g => g.id !== id);
        await this.deleteFromDB('groups', id);
        this.renderGroups();
        this.updateStats();
        this.logActivity('trash-2', 'danger', `${t.groupDeleted} ${group.name}`);
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
            display.textContent = this.currentJournalMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        }
    }

    updateWeekDisplay() {
        const display = document.getElementById('current-week-display');
        if (display) {
            const t = this.translations[this.settings.language];
            display.textContent = `${t.week} ${this.currentJournalWeek + 1}`;
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
        const t = this.translations[this.settings.language];
        const select = document.getElementById('group-select');
        if (!select) return;

        select.innerHTML = `<option value="">${t.selectGroupJournal}</option>` +
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
        const t = this.translations[this.settings.language];
        const tbody = document.getElementById('journal-tbody');
        if (!tbody) return;

        const group = this.groups.find(g => g.id === this.currentJournalGroupId);
        if (!group || !group.schedule) {
            tbody.innerHTML = `<tr><td colspan="10">${t.noScheduleForGroup}</td></tr>`;
            return;
        }

        const monthlyWeeks = this.generateMonthlyJournal(group, month);
        const currentWeekData = monthlyWeeks[this.currentJournalWeek];
        
        if (!currentWeekData) {
            tbody.innerHTML = `<tr><td colspan="10">${t.noDataForWeek}</td></tr>`;
            return;
        }

        const lessonDaysInWeek = currentWeekData.filter(day => day && day.hasLesson);
        const daysInWeekCount = lessonDaysInWeek.length;

        // Update table header for the week
        const journalTable = document.getElementById('journal-table');
        const thead = journalTable.querySelector('thead');
        thead.innerHTML = `
            <tr>
                <th rowspan="2">${t.student}</th>
                <th colspan="${daysInWeekCount * 3}">${t.week} ${this.currentJournalWeek + 1} (${month.toLocaleString('en-US', { month: 'long', year: 'numeric' })})</th>
                <th rowspan="2">${t.bonuses}</th>
                <th rowspan="2">${t.total}</th>
            </tr>
            <tr id="journal-dates-row"></tr>
        `;

        const datesRow = document.getElementById('journal-dates-row');
        const dayNames = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday]; // Adjusted for getDay()

        lessonDaysInWeek.forEach(day => {
            datesRow.innerHTML += `
                <th colspan="3">${dayNames[day.date.getDay()]}<br>${day.date.getDate()}</th>
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
        const t = this.translations[this.settings.language];
        const grid = document.getElementById('monthly-summary-grid');
        if (!grid) return;

        const monthYear = month.toISOString().substring(0, 7); // YYYY-MM

        if (students.length === 0) {
            grid.innerHTML = `<p class="no-data">${t.noActiveStudentsInGroup}</p>`;
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
                        <span class="label">${t.gradesForLessons}</span>
                        <span class="value">${totalGradesForMonth}</span>
                    </div>
                    <div class="monthly-summary-item">
                        <span class="label">${t.examScores}</span>
                        <input type="number" min="0" max="100" value="${monthlyAssessment.examScore || ''}"
                               onchange="app.updateExamScore('${groupId}', '${student.id}', this.value)">
                    </div>
                    <div class="monthly-summary-item">
                        <span class="label">${t.bonusPoints}</span>
                        <span class="value">${totalMonthlyBonus}</span>
                    </div>
                    <div class="total-grade">${t.total}: ${totalSum}</div>
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
        const t = this.translations[this.settings.language];
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
            toggleBtn.textContent = t.month;
        } else {
            weeklyView.style.display = 'none';
            monthlyView.style.display = 'block';
            monthNav.style.display = 'flex';
            weekNav.style.display = 'none';
            toggleBtn.textContent = t.week;
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
        const t = this.translations[this.settings.language];
        
        const titles = {
            attendance: t.attendanceReport,
            grades: t.studentPerformance,
            activity: t.groupActivity
        };
        titleElement.textContent = titles[reportType] || t.reportOptions;

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
        const t = this.translations[this.settings.language];

        switch (this.currentReportType) {
            case 'attendance':
                reportTitle = t.attendanceReport;
                reportContent = this.generateAttendanceReport(groupId, studentId, startDate, endDate);
                break;
            case 'grades':
                reportTitle = t.studentPerformance;
                reportContent = this.generateGradesReport(groupId, studentId, startDate, endDate);
                break;
            case 'activity':
                reportTitle = t.groupActivity;
                reportContent = this.generateActivityReport(groupId, startDate, endDate);
                break;
        }

        this.showReportModal(reportTitle, reportContent);
    }

    generateAttendanceReport(filterGroupId = 'all', filterStudentId = 'all', startDate = null, endDate = null) {
        const t = this.translations[this.settings.language];
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
            return `<p class="no-data">${t.noDataForFilters}</p>`;
        }

        let html = `
            <div class="report-section">
                <h3>${t.attendanceByStudents}</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t.student}</th>
                            <th>${t.group}</th>
                            <th>${t.attended}</th>
                            <th>${t.totalLessons}</th>
                            <th>${t.percentage}</th>
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
                        <div class="label">${t.averageCourseAttendance}</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${attendanceData.filter(item => item.percentage >= 80).length}</div>
                        <div class="label">${t.studentsWithGoodAttendance}</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateGradesReport(filterGroupId = 'all', filterStudentId = 'all', startDate = null, endDate = null) {
        const t = this.translations[this.settings.language];
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
            return `<p class="no-data">${t.noDataForFilters}</p>`;
        }

        let html = `
            <div class="report-section">
                <h3>${t.studentGrades}</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t.student}</th>
                            <th>${t.group}</th>
                            <th>${t.averageGradeReport}</th>
                            <th>${t.totalScores}</th>
                            <th>${t.gradeCount}</th>
                            <th>${t.maxGrade}</th>
                            <th>${t.minGrade}</th>
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
                        <div class="label">${t.averageCourseGrade}</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${gradesData.filter(item => item.average >= 4).length}</div>
                        <div class="label">${t.studentsWithGoodGrades}</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateActivityReport(filterGroupId = 'all', startDate = null, endDate = null) {
        const t = this.translations[this.settings.language];
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
            return `<p class="no-data">${t.noDataForFilters}</p>`;
        }

        let html = `
            <div class="report-section">
                <h3>${t.groupActivityReport}</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t.group}</th>
                            <th>${t.studentsInGroup}</th>
                            <th>${t.lessonsPerWeek}</th>
                            <th>${t.attendance}</th>
                            <th>${t.status}</th>
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
                        <div class="label">${t.totalGroups}</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${groupData.filter(item => item.attendance >= 80).length}</div>
                        <div class="label">${t.activeGroupsReport}</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${groupData.reduce((sum, item) => sum + item.students, 0)}</div>
                        <div class="label">${t.studentsInGroups}</div>
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
        const t = this.translations[this.settings.language];
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
        btn.textContent = t.saved;
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
        const t = this.translations[this.settings.language];
        const student = this.students.find(s => s.id === this.currentStudentId);
        if (!student) return;
    
        const group = this.groups.find(g => g.id === student.group);
        const initials = `${student.name[0]}${student.surname[0]}`.toUpperCase();
    
        document.getElementById('analytics-student-name').textContent = `${student.name} ${student.surname}`;
        document.getElementById('analytics-student-group').textContent = group ? group.name : t.noGroup;
    
        const avatarElement = document.getElementById('analytics-student-avatar');
        avatarElement.innerHTML = ''; // Clear previous content

        if (student.avatar) {
            const img = document.createElement('img');
            img.src = student.avatar;
            img.alt = 'Student Avatar';
            avatarElement.appendChild(img);
            avatarElement.style.background = 'none';
        } else {
            avatarElement.textContent = initials;
            avatarElement.style.background = student.avatarColor || this.getRandomColor();
            avatarElement.style.color = 'white';
        }
    
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
    
        const missedSessions = totalScheduledSessions - attendedSessions;
        const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(1) : 0;
    
        // Populate new UI elements
        document.getElementById('analytics-student-contact').innerHTML = `
            ${student.phone ? `<div class="contact-item"><i data-lucide="phone"></i><span>${student.phone}</span></div>` : ''}
        `;
        document.getElementById('analytics-student-details').innerHTML = `
            ${student.dob ? `<div class="detail-item"><strong>${t.birthDate}</strong> ${new Date(student.dob).toLocaleDateString('en-US')}</div>` : ''}
            ${student.classNumber && student.classLetter ? `<div class="detail-item"><strong>${t.class}</strong> ${student.classNumber}${student.classLetter}</div>` : ''}
            <div class="detail-item"><strong>${t.status}</strong> <span class="status-${student.status}">${student.status === 'active' ? t.activeStatus : t.archivedStatus}</span></div>
        `;

        this.animateNumber('analytics-attendance-rate', attendanceRate, '%');
        this.animateNumber('analytics-missed-lessons', missedSessions);
        this.animateNumber('analytics-total-lessons', totalScheduledSessions);
        this.animateNumber('analytics-average-grade', averageGrade);
    
        this.renderStudentGradesChart(student.id);
        this.renderStudentRecentComments(studentComments);
        
        // Initialize current month for analytics weekly scores
        this.currentAnalyticsMonth = new Date();
        this.renderStudentWeeklyScores(student.id, this.currentAnalyticsMonth);
        this.renderStudentWeeklyScoresChart(student.id, this.currentAnalyticsMonth);

        lucide.createIcons();
    }

    renderStudentWeeklyScores(studentId, month) {
        const t = this.translations[this.settings.language];
        const container = document.getElementById('analytics-weekly-scores');
        const monthDisplay = document.getElementById('analytics-current-month-display');
        if (!container || !monthDisplay) return;

        const locale = this.settings.language === 'ru' ? 'ru-RU' : 'en-US';
        monthDisplay.textContent = month.toLocaleString(locale, { month: 'long', year: 'numeric' });

        const student = this.students.find(s => s.id === studentId);
        if (!student || !student.group) {
            container.innerHTML = `<p class="no-data">${t.noGroupAttached}</p>`;
            return;
        }

        const group = this.groups.find(g => g.id === student.group);
        if (!group || !group.schedule) {
            container.innerHTML = `<p class="no-data">${t.noScheduleForStudentGroup}</p>`;
            return;
        }

        const monthlyWeeks = this.generateMonthlyJournal(group, month);
        const monthYear = month.toISOString().substring(0, 7);

        if (monthlyWeeks.length === 0) {
            container.innerHTML = `<p class="no-data">${t.noLessonDataForMonth}</p>`;
            return;
        }

        container.innerHTML = monthlyWeeks.map((weekData, weekIndex) => {
            let weekTotalGrade = 0;
            let hasLessonInWeek = false;

            weekData.forEach(day => {
                if (day && day.hasLesson) {
                    hasLessonInWeek = true;
                    const dateKey = day.date.toISOString().split('T')[0];
                    const studentDayData = (this.journal[group.id]?.[dateKey]?.[student.id]) || {};
                    if (studentDayData.grade && studentDayData.grade > 0) {
                        weekTotalGrade += Number(studentDayData.grade);
                    }
                }
            });

            const monthlyAssessment = this.monthlyAssessments[group.id]?.[monthYear]?.[student.id] || { weeklyBonuses: {} };
            const weeklyBonus = monthlyAssessment.weeklyBonuses?.[weekIndex] || 0;
            const totalScore = weekTotalGrade + weeklyBonus;

            if (!hasLessonInWeek) {
                return ''; // Don't display weeks without scheduled lessons
            }

            return `
                <div class="weekly-score-item">
                    <span class="week-label">${t.weekLabel} ${weekIndex + 1}:</span>
                    <span class="score-value">${totalScore} ${t.scores}</span>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    prevAnalyticsMonth() {
        this.currentAnalyticsMonth.setMonth(this.currentAnalyticsMonth.getMonth() - 1);
        this.renderStudentWeeklyScores(this.currentStudentId, this.currentAnalyticsMonth);
        this.renderStudentWeeklyScoresChart(this.currentStudentId, this.currentAnalyticsMonth);
    }

    nextAnalyticsMonth() {
        this.currentAnalyticsMonth.setMonth(this.currentAnalyticsMonth.getMonth() + 1);
        this.renderStudentWeeklyScores(this.currentStudentId, this.currentAnalyticsMonth);
        this.renderStudentWeeklyScoresChart(this.currentStudentId, this.currentAnalyticsMonth);
    }

    renderStudentGradesChart(studentId) {
        const t = this.translations[this.settings.language];
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
        
        const sortedLabels = sortedData.map(item => item.date.toLocaleDateString('en-US'));
        const sortedGrades = sortedData.map(item => item.grade);

        if (this.studentGradesChart) {
            this.studentGradesChart.destroy();
        }

        this.studentGradesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: t.studentGrades,
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
                                return `${t.grade}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: t.date,
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
                                text: t.grade,
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
        const t = this.translations[this.settings.language];
        const container = document.getElementById('analytics-recent-comments');
        if (!container) return;

        if (comments.length === 0) {
            container.innerHTML = `<p class="no-comments">${t.noCommentsForStudent}</p>`;
            return;
        }

        // Sort comments by date, newest first
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = comments.map(comment => {
            const commentDate = new Date(comment.date);
            return `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-group">${comment.groupName}</span>
                        <span class="comment-date">${commentDate.toLocaleDateString('en-US')}</span>
                    </div>
                    <p class="comment-text">${comment.comment}</p>
                </div>
            `;
        }).join('');
        lucide.createIcons();
    }

    renderStudentWeeklyScoresChart(studentId, month) {
        const t = this.translations[this.settings.language];
        const ctx = document.getElementById('studentWeeklyScoresChart');
        if (!ctx) return;

        const student = this.students.find(s => s.id === studentId);
        if (!student || !student.group) {
            if (this.studentWeeklyScoresChart) {
                this.studentWeeklyScoresChart.destroy();
                this.studentWeeklyScoresChart = null;
            }
            return;
        }

        const group = this.groups.find(g => g.id === student.group);
        if (!group || !group.schedule) {
            if (this.studentWeeklyScoresChart) {
                this.studentWeeklyScoresChart.destroy();
                this.studentWeeklyScoresChart = null;
            }
            return;
        }

        const monthlyWeeks = this.generateMonthlyJournal(group, month);
        const labels = monthlyWeeks.map((_, index) => `${t.weekLabel} ${index + 1}`);
        const monthYear = month.toISOString().substring(0, 7);

        const studentWeeklyScores = monthlyWeeks.map((weekData, weekIndex) => {
            let weekTotalGrade = 0;
            weekData.forEach(day => {
                if (day && day.hasLesson) {
                    const dateKey = day.date.toISOString().split('T')[0];
                    const studentDayData = (this.journal[group.id]?.[dateKey]?.[student.id]) || {};
                    if (studentDayData.grade && studentDayData.grade > 0) {
                        weekTotalGrade += Number(studentDayData.grade);
                    }
                }
            });
            const monthlyAssessment = this.monthlyAssessments[group.id]?.[monthYear]?.[student.id] || { weeklyBonuses: {} };
            const weeklyBonus = monthlyAssessment.weeklyBonuses?.[weekIndex] || 0;
            return weekTotalGrade + weeklyBonus;
        });

        if (this.studentWeeklyScoresChart) {
            this.studentWeeklyScoresChart.data.labels = labels;
            this.studentWeeklyScoresChart.data.datasets[0].data = studentWeeklyScores;
            this.studentWeeklyScoresChart.update();
        } else {
            this.studentWeeklyScoresChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: t.scoresByWeeks,
                        data: studentWeeklyScores,
                        backgroundColor: '#4A6CFD',
                        borderColor: '#3a5de0',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
    }

    // Event listeners for analytics month navigation
    initAnalyticsEventListeners() {
        document.getElementById('analytics-prev-month-btn').addEventListener('click', () => this.prevAnalyticsMonth());
        document.getElementById('analytics-next-month-btn').addEventListener('click', () => this.nextAnalyticsMonth());
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

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    generateDefaultAvatar(name, surname = '') {
        const initials = surname
            ? `${name[0]}${surname[0]}`.toUpperCase()
            : name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
        const canvas = document.createElement('canvas');
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Background color
        ctx.fillStyle = this.getRandomColor();
        ctx.fillRect(0, 0, size, size);

        // Text (initials)
        ctx.fillStyle = 'white';
        ctx.font = `bold ${size / 2}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, size / 2, size / 2);

        return canvas.toDataURL(); // Returns a data URL (Base64)
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
