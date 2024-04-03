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

function addExpense(userData){
    const token = localStorage.getItem('token');
    axios.post('/addExpense',userData,{headers:{"Authorization":token}})
        .then((response)=>{
            console.log("Expense added!",response);
            addUser(response.data.expense);

        }).catch((error)=>{
            console.log(error);
        })
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
        
        console.log("User data:", userData);
        deleteExpense(userData.id,row);
        row.remove(); 
    }
})

function deleteExpense(id){
    const token = localStorage.getItem('token');
    axios.get('/deleteExpense'+`/${id}`,{headers:{"Authorization":token}})
       .then((response)=>{ 
           console.log(response.data)                  
   })
}

function displayExpenses(){
    const token = localStorage.getItem('token');
    axios.get('/getExpenses',{headers:{"Authorization":token}})
        .then((response)=>{
            const length = Object.keys(response.data.expense).length;
            for(let i=0;i<length;i++){
                const data = response.data.expense[i];
                addUser(data);
            }
    })
}

window.addEventListener('load',()=>{
    displayExpenses();
})
