document.addEventListener('DOMContentLoaded', () => {
    // الحصول على العناصر الرئيسية من شجرة المستند
    const appContent = document.getElementById('app-content');
    const pageTitle = document.getElementById('page-title');
    const navBtns = document.querySelectorAll('.nav-btn');
    const headerActionBtn = document.getElementById('header-action-btn');

    // بيانات وهمية لمحاكاة قاعدة بيانات التطبيق (IndexedDB/LocalStorage)
    let customers = [
        { id: 1, name: 'أحمد عبدالله', phone: '0501234567', remaining: 5000 },
        { id: 2, name: 'مؤسسة التقنية', phone: '0509876543', remaining: 12500 }
    ];

    let investors = [
        { id: 1, name: 'عمر موسى', wallet: 50000 },
        { id: 2, name: 'محفظة الطوارئ', wallet: 10000 }
    ];

    // نظام التوجيه (Router) للتبديل بين الشاشات
    const routes = {
        home: {
            title: 'الرئيسية',
            render: renderHome,
            showAction: false
        },
        customers: {
            title: 'العملاء',
            render: renderCustomers,
            showAction: true,
            actionIcon: 'fa-user-plus'
        },
        investors: {
            title: 'المستثمرون',
            render: renderInvestors,
            showAction: true,
            actionIcon: 'fa-plus'
        },
        settings: {
            title: 'الإعدادات',
            render: renderSettings,
            showAction: false
        }
    };

    function navigate(target) {
        const route = routes[target];
        if (!route) return;

        // تحديث الواجهة العلوية
        pageTitle.textContent = route.title;
        navBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.nav-btn[data-target="${target}"]`).classList.add('active');

        // إظهار أو إخفاء زر الإضافة العلوي
        if (route.showAction) {
            headerActionBtn.classList.remove('hidden');
            headerActionBtn.innerHTML = `<i class="fas ${route.actionIcon}"></i>`;
        } else {
            headerActionBtn.classList.add('hidden');
        }

        // مسح المحتوى القديم وتصيير الشاشة الجديدة
        appContent.innerHTML = '';
        route.render();
    }

    // إضافة مستمعي الأحداث لأزرار الشريط السفلي
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.target));
    });

    // --- دوال بناء الشاشات ---

    // 1. الشاشة الرئيسية
    function renderHome() {
        let totalMarket = customers.reduce((sum, c) => sum + c.remaining, 0);
        
        let html = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>إجمالي السوق</h3>
                    <p>${totalMarket} ريال</p>
                </div>
                <div class="stat-card danger">
                    <h3>أقساط متأخرة</h3>
                    <p>2500 ريال</p>
                </div>
            </div>
            <h3 style="margin-bottom: 10px; font-size: 1.1rem;">أحدث العملاء النشطين</h3>
            <div>
        `;
        customers.forEach(c => {
            html += `
                <div class="list-item">
                    <div>
                        <div class="list-item-title">${c.name}</div>
                        <div class="list-item-subtitle">${c.phone}</div>
                    </div>
                    <div style="color: var(--primary-color); font-weight: bold; font-size: 1.1rem;">
                        ${c.remaining} ريال
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        appContent.innerHTML = html;
    }

    // 2. شاشة العملاء والعقود
    function renderCustomers() {
        let html = `
            <div style="margin-bottom: 20px;">
                <input type="text" placeholder="ابحث عن اسم أو رقم عميل..." 
                       style="width:100%; padding:12px; border-radius:8px; border:1px solid #ddd; font-family: inherit;">
            </div>
            <div>
        `;
        customers.forEach(c => {
            html += `
                <div class="list-item">
                    <div>
                        <div class="list-item-title">${c.name}</div>
                        <div class="list-item-subtitle">متبقي: ${c.remaining} ريال</div>
                    </div>
                    <a href="tel:${c.phone}" class="icon-btn">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>
            `;
        });
        html += `</div>`;
        appContent.innerHTML = html;
    }

    // 3. شاشة المستثمرين والمحافظ
    function renderInvestors() {
        let html = `<div>`;
        investors.forEach(inv => {
            html += `
                <div class="list-item">
                    <div>
                        <div class="list-item-title"><i class="fas fa-briefcase" style="color:var(--secondary-color);"></i> ${inv.name}</div>
                        <div class="list-item-subtitle">المحفظة الحالية</div>
                    </div>
                    <div style="font-weight: bold; font-size: 1.1rem;">
                        ${inv.wallet} ريال
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        appContent.innerHTML = html;
    }

    // 4. شاشة الإعدادات
    function renderSettings() {
        appContent.innerHTML = `
            <div class="list-item" style="cursor:pointer;" onclick="alert('جاري تجهيز النسخة الاحتياطية...')">
                <div class="list-item-title"><i class="fas fa-cloud-download-alt"></i> نسخ احتياطي محلي</div>
            </div>
            <div class="list-item" style="cursor:pointer;">
                <div class="list-item-title"><i class="fas fa-language"></i> تغيير لغة التطبيق</div>
            </div>
            <div class="list-item" style="cursor:pointer; color: var(--danger-color);" onclick="confirm('هل أنت متأكد من مسح كافة البيانات؟')">
                <div class="list-item-title"><i class="fas fa-trash"></i> مسح كافة البيانات نهائياً</div>
            </div>
        `;
    }

    // بدء تشغيل التطبيق على الواجهة الرئيسية
    navigate('home');
});
