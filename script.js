let people = [];
let expenses = [];

/* ================= ADD PERSON ================= */
function addPerson() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("personName").value.trim();

  if (role !== "admin") {
    alert("Only Admin can add members");
    return;
  }

  if (!name || people.includes(name)) {
    alert("Invalid or duplicate name");
    return;
  }

  people.push(name);
  document.getElementById("personName").value = "";
  refreshPeopleUI();
}

/* ================= REFRESH PEOPLE ================= */
function refreshPeopleUI() {
  const list = document.getElementById("peopleList");
  const select = document.getElementById("paidBy");

  list.innerHTML = "";
  select.innerHTML = `<option value="">Paid By</option>`;

  people.forEach(p => {
    list.innerHTML += `
      <li>
        <img src="images/user.png" class="avatar">
        ${p}
      </li>`;
    select.innerHTML += `<option value="${p}">${p}</option>`;
  });
}

/* ================= ADD EXPENSE ================= */
function addExpense() {
  const paidBy = document.getElementById("paidBy").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!paidBy || amount <= 0) {
    alert("Invalid expense data");
    return;
  }

  expenses.push({ paidBy, amount });
  document.getElementById("amount").value = "";
  refreshExpenseHistory();
}

/* ================= EXPENSE HISTORY ================= */
function refreshExpenseHistory() {
  const history = document.getElementById("expenseHistory");
  history.innerHTML = "";

  expenses.forEach((e, index) => {
    history.innerHTML += `
      <li class="expense-item">
        ${e.paidBy} paid ₹${e.amount}
        <span>
          <button onclick="editExpense(${index})">✏️</button>
          <button onclick="deleteExpense(${index})">🗑️</button>
        </span>
      </li>`;
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  refreshExpenseHistory();
}

function editExpense(index) {
  const newAmount = prompt("Enter new amount", expenses[index].amount);
  if (newAmount && newAmount > 0) {
    expenses[index].amount = parseFloat(newAmount);
    refreshExpenseHistory();
  }
}

/* ================= WHO PAYS WHOM ================= */
function calculateSettlement() {
  const summary = document.getElementById("summary");
  summary.innerHTML = "";

  if (people.length === 0 || expenses.length === 0) {
    alert("Add people and expenses first");
    return;
  }

  let balance = {};
  people.forEach(p => balance[p] = 0);

  let total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let share = total / people.length;

  expenses.forEach(e => balance[e.paidBy] += e.amount);
  people.forEach(p => balance[p] -= share);

  let creditors = [];
  let debtors = [];

  for (let p in balance) {
    if (balance[p] > 0)
      creditors.push({ name: p, amt: balance[p] });
    else if (balance[p] < 0)
      debtors.push({ name: p, amt: -balance[p] });
  }

  creditors.forEach(c => {
    debtors.forEach(d => {
      if (c.amt > 0 && d.amt > 0) {
        let pay = Math.min(c.amt, d.amt);
        summary.innerHTML += `
          <li class="debit">
            ${d.name} pays ₹${pay.toFixed(2)} to ${c.name}
          </li>`;
        c.amt -= pay;
        d.amt -= pay;
      }
    });
  });
}
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("dark");
};

