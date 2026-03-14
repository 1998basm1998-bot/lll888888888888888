document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب العناصر الرئيسية من واجهة المستخدم
    const appContent = document.getElementById('app-content');
    const pageTitle = document.getElementById('page-title');
    const navBtns = document.querySelectorAll('.nav-btn');
    const headerActionBtn = document.getElementById('header-action-btn');

    // 2. محاكاة قاعدة البيانات (سنقوم بربطها بـ LocalStorage أو قاعدة بيانات حقيقية لاحقاً)
    let db = {
        customers: [
            { id: 1, name: 'أحمد عبدالله', phone: '0501234567' },
            { id: 2, name: 'محمود سعد', phone: '0509876543' }
        ],
        contracts: [
            { id: 101, customerId: 1, type: 'مجدول', totalAmount: 6000, paid: 1000, remaining: 5000, status: 'نشط' },
            { id: 102, customerId: 2, type: 'مفتوح', totalAmount: 3000, paid: 1500, remaining: 1500, status: 'نشط' }
        ],
        investors: [
            { id: 1, name: 'عمر موسى', wallet: 50000, profit: 2500 },
            { id: 2, name: 'محفظة الطوارئ', wallet: 10000, profit: 0 }
        ]
    };

    // 3. نظام التوجيه (Router) للتنقل بين الشاشات
    const routes = {
        home: { title: 'نظرة عامة', render: renderHome, showAction: false },
        customers: { title: 'سجل العملاء', render: renderCustomers, showAction: true, actionIcon: 'fa-user-plus' },
        contracts: { title: 'العقود والأقساط', render: renderContracts, showAction: true, actionIcon: 'fa-file-medical' },
        investors: { title: 'المستثمرون', render: renderInvestors, showAction: true, actionIcon: 'fa-plus' }
    };

    // دالة الانتقال بين الشاشات
    function navigate(target) {
        const route = routes[target];
        if (!route) return;

        // تحديث العنوان وتفعيل الزر السفلي
        pageTitle.textContent = route.title;
        navBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.nav-btn[data-target="${target}"]`).classList.add('active');

        // إدارة زر الإضافة في الأعلى
        if (route.showAction) {
            headerActionBtn.classList.remove('hidden');
            headerActionBtn.innerHTML = `<i class="fas ${route.actionIcon}"></i>`;
        } else {
            headerActionBtn.classList.add('hidden');
        }

        // تفريغ المحتوى ورسم الشاشة المطلوبة
        appContent.innerHTML = '';
        route.render();
    }

    // ربط أزرار التنقل السفلية بالدالة
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.target));
    });

    // --- دوال رسم الشاشات ---

    // أ. الشاشة الرئيسية (Dashboard)
    function renderHome() {
        let totalRemaining = db.contracts.reduce((sum, c) => sum + c.remaining, 0);
        
        let html = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>إجمالي الديون بالسوق</h3>
                    <p>${totalRemaining} $</p>
                </div>
                <div class="stat-card danger">
                    <h3>أقساط متأخرة</h3>
                    <p>250 $</p>
                </div>
            </div>
            <h3 style="margin-bottom: 15px; color: var(--text-secondary);">أحدث العقود</h3>
        `;
        
        db.contracts.forEach(contract => {
            let customer = db.customers.find(c => c.id === contract.customerId);
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="title">${customer.name}</div>
                        <div class="subtitle">عقد ${contract.type} - المتبقي: ${contract.remaining}$</div>
                    </div>
                    <span class="badge">${contract.status}</span>
                </div>
            `;
        });
        appContent.innerHTML = html;
    }

    // ب. شاشة العملاء
    function renderCustomers() {
        let html = `
            <input type="text" placeholder="ابحث عن عميل برقم الهاتف أو الاسم..." 
                   style="width:100%; padding:12px; margin-bottom:15px; border-radius:8px; border:1px solid #ddd; font-family: inherit;">
        `;
        db.customers.forEach(c => {
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="title">${c.name}</div>
                        <div class="subtitle"><i class="fas fa-phone"></i> ${c.phone}</div>
                    </div>
                    <button style="background:none; border:none; color:var(--primary-color); font-size:1.2rem;"><i class="fas fa-chevron-left"></i></button>
                </div>
            `;
        });
        appContent.innerHTML = html;
    }

    // ج. شاشة العقود (جديدة بناءً على تحليلك)
    function renderContracts() {
        let html = ``;
        db.contracts.forEach(contract => {
            let customer = db.customers.find(c => c.id === contract.customerId);
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="title">عقد رقم #${contract.id} - ${customer.name}</div>
                        <div class="subtitle">إجمالي العقد: ${contract.totalAmount}$ | المدفوع: ${contract.paid}$</div>
                    </div>
                    <div class="list-item-value">${contract.remaining}$</div>
                </div>
            `;
        });
        appContent.innerHTML = html;
    }

    // د. شاشة المستثمرين
    function renderInvestors() {
        let html = ``;
        db.investors.forEach(inv => {
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="title"><i class="fas fa-briefcase"></i> ${inv.name}</div>
                        <div class="subtitle">الأرباح: ${inv.profit}$</div>
                    </div>
                    <div class="list-item-value">${inv.wallet}$</div>
                </div>
            `;
        });
        appContent.innerHTML = html;
    }

    // تشغيل التطبيق بالبدء من الشاشة الرئيسية
    navigate('home');
});
