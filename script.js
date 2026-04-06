let transactions = [
    { id: 1, date: 'Apr 01', amount: 5000, category: 'Salary', type: 'income' },
    { id: 2, date: 'Apr 02', amount: 800, category: 'Rent', type: 'expense' },
    { id: 3, date: 'Apr 05', amount: 150, category: 'Food', type: 'expense' },
    { id: 4, date: 'Apr 06', amount: 400, category: 'Bonus', type: 'income' }
];

let currentSymbol = "$";

// 1. NAVIGATION
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(viewId + '-view').style.display = 'block';
    const navs = document.querySelectorAll('.nav-item');
    navs.forEach(n => { if(n.innerText.toLowerCase().includes(viewId)) n.classList.add('active'); });

    if(viewId === 'analytics') renderAnalytics();
}

// 2. RBAC (Admin/Viewer Logic)
function handleRoleChange(role) {
    const addBtn = document.getElementById('addBtn');
    if (role === 'viewer') {
        addBtn.style.display = 'none'; // Completely hide for viewers
    } else {
        addBtn.style.display = 'flex'; // Show for admin
    }
}

// 3. RENDER DASHBOARD
function render() {
    const tableBody = document.getElementById('tableBody');
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = transactions.filter(t => t.category.toLowerCase().includes(query));

    tableBody.innerHTML = filtered.map(t => `
        <tr>
            <td><b>${t.category}</b><br><small>${t.date}</small></td>
            <td><span class="status-pill status-${t.type}">${t.type}</span></td>
            <td class="text-right" style="color:${t.type === 'income' ? '#22c55e' : 'inherit'}; font-weight:800;">
                ${t.type === 'income' ? '+' : '-'}${currentSymbol}${t.amount.toLocaleString()}
            </td>
        </tr>
    `).join('');

    updateStats();
}

function updateStats() {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    document.getElementById('incomeText').innerText = `${currentSymbol}${income.toLocaleString()}`;
    document.getElementById('expenseText').innerText = `${currentSymbol}${expense.toLocaleString()}`;
    document.getElementById('balanceText').innerText = `${currentSymbol}${(income - expense).toLocaleString()}`;
}

// 4. VERTICAL ANALYTICS GRAPH (Income + Expense)
function renderAnalytics() {
    const container = document.getElementById('chartContainer');
    const maxAmount = Math.max(...transactions.map(t => t.amount), 1);

    container.innerHTML = transactions.map(t => `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
            <span style="font-size:9px; font-weight:800; margin-bottom:5px;">${currentSymbol}${t.amount}</span>
            <div style="width:30px; background:${t.type === 'income' ? '#22c55e' : '#6366f1'}; 
                        height:${(t.amount / maxAmount) * 100}%; border-radius:8px 8px 0 0; 
                        transition: height 0.5s ease;"></div>
            <span style="font-size:10px; font-weight:800; margin-top:10px; text-align:center;">${t.category}</span>
        </div>
    `).join('');
}

// 5. NEW ENTRY (Admin Only)
document.getElementById('addBtn').addEventListener('click', () => {
    const cat = prompt("Category Name (e.g., Coffee, Refund):");
    const amtInput = prompt("Amount:");
    const typInput = prompt("Type (income/expense):");

    if (cat && amtInput && typInput) {
        const amt = parseFloat(amtInput);
        const typ = typInput.toLowerCase().trim();
        if (!isNaN(amt) && (typ === 'income' || typ === 'expense')) {
            transactions.unshift({ id: Date.now(), date: 'Apr 06', amount: amt, category: cat, type: typ });
            render();
            showView('dashboard');
        }
    }
});

// 6. SETTINGS (Currency Update)
document.getElementById('currencySelect').addEventListener('change', (e) => {
    currentSymbol = e.target.value;
    render(); // Re-render table and stats with new symbol
});

// 7. INITIALIZATION
document.getElementById('searchInput').addEventListener('input', render);
document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    lucide.createIcons();
});

lucide.createIcons();
render();