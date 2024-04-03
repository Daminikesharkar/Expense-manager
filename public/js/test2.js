import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

//add expense logic
const expenseform = document.getElementById('add-expense-form');

const amount = document.getElementById('price');
const description = document.getElementById('item');
const category = document.getElementById('category');

expenseform.addEventListener("submit",(event)=>{
    event.preventDefault()

    const userData ={
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    addExpense(userData);
    console.log(userData);
    expenseform.reset();
})

async function addExpense(userData) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/addExpense', userData, { headers: { "Authorization": token } });
        addUser(response.data.expense);
    } catch (error) {
        console.error("Error adding product", error.message);
    }
}

function addUser(userData){
    const tbody = document.querySelector(".tablecontainer table tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${userData.description}</td>
        <td>${userData.amount}</td>
        <td>${userData.category}</td>
        <td><a href='#' class=delete data-user-data='${JSON.stringify(userData)}'>Remove</a></td>
    `;

    if (tbody.firstChild) {
        tbody.insertBefore(newRow, tbody.firstChild);
    } else {
        tbody.appendChild(newRow);
    }
}


const table = document.getElementById('expense_table');
table.addEventListener('click',(e)=>{
    e.preventDefault();
    if(e.target.classList.contains('delete')){
        const row = e.target.parentElement.parentElement;

        const userDataString = e.target.getAttribute("data-user-data");
        const userData = JSON.parse(userDataString);
        deleteExpense(userData.id,row);
        row.remove(); 
    }
})

async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/deleteExpense/${id}`, { headers: { "Authorization": token } });
        console.log(response.data);
        alert(response.data.message);
    } catch (error) {
        console.error("Error deleting product", error.message);
    }
}

//pagination
const ExpensesPerPageSelect = document.getElementById('ExpensesPerPage');
const savePreferenceBtn = document.getElementById('savePreferenceBtn');

function getExpensesPerPage() {
    return localStorage.getItem('productsPerPage') || 10; 
}

function setExpensesPerPage(value) {
    localStorage.setItem('productsPerPage', value);
}

savePreferenceBtn.addEventListener('click', (event)=> {
    event.preventDefault();
    const value = ExpensesPerPageSelect.value;
    console.log(value);
    setExpensesPerPage(value);
    location.reload();
});

function displayExpensesPerPagePreference() {
    ExpensesPerPageSelect.value = getExpensesPerPage();
}

displayExpensesPerPagePreference();

const pagination = document.getElementById('pagination');

async function getExpenses(page){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/getExpenses/?page=${page}`,{headers:{"Authorization":token}});

        displayExpenses(response.data.expenses);
        showPagination(response.data);
        
    } catch (error) {
        console.error("Error getting all expenses", error.message);
    }
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){
    pagination.innerHTML='';

    if(hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click',()=>{
            getExpenses(previousPage);
        })
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click',()=>{
        getExpenses(currentPage);
    })
    pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click',()=>{
            getExpenses(nextPage);
        })
        pagination.appendChild(btn3);
    }
}

function displayExpenses(expenses){
    const tbody = document.querySelector(".tablecontainer table tbody");
    tbody.innerHTML = '';

    const length = Object.keys(expenses).length;
    for(let i=0;i<length;i++){
        const data = expenses[i];
        addUser(data);
    }
}

async function displayAllExpenses(){
    const page = 1;
    const itemsPerPage = getExpensesPerPage();

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/getExpenses/?page=${page}&itemsPerPage=${itemsPerPage}`,{headers:{"Authorization":token}});

        displayExpenses(response.data.expenses);
        showPagination(response.data);
        
    } catch (error) {
        console.error("Error getting all expenses", error.message);
    }
}

window.addEventListener('load',()=>{
    displayAllExpenses();
})
