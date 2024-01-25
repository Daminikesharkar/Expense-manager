import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const form = document.getElementById('expenseForm');

const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');


function addExpense(userData){
    axios.post('/addExpense',userData)
        .then((response)=>{
            console.log("Expense added!",response);
            addUser(response.data.expense);

        }).catch((error)=>{
            console.log(error);
        })
}

function deleteExpense(id){
    axios.get('/deleteExpense'+`/${id}`)
       .then((response)=>{ 
           console.log(response.data.book )         
   })
}

form.addEventListener("submit",(event)=>{
    event.preventDefault()

    const userData ={
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    addExpense(userData);
    form.reset();
})

function addUser(userData){
    const ulList = document.getElementById('newExpense');

    const li = document.createElement('li');
    li.className="expenseList";
    li.setAttribute('data-user-data', JSON.stringify(userData));

    var btn = document.createElement("button");
    btn.className = "btn delete";

    var editBtn = document.createElement("button");
    editBtn.className = "btn edit";

    var text = document.createTextNode("Amount: "+userData.amount+" description: "+userData.description+" category: "+userData.category);
    li.appendChild(text);


    btn.appendChild(document.createTextNode("Delete"));
    editBtn.appendChild(document.createTextNode("Edit"));

    li.appendChild(btn);
    li.appendChild(editBtn);

    ulList.appendChild(li);
}

const ulList = document.getElementById('newExpense');
ulList.addEventListener('click',(e)=>{
    if(e.target.classList.contains('delete')){
        const li = e.target.parentElement;
        const userData = JSON.parse(li.getAttribute('data-user-data'))
        
        deleteExpense(userData.id);
        li.remove();
    }
})

function displayExpenses(){
    const token = localStorage.getItem('token');
    axios.get('/getExpenses',{headers:{"Authorization":token}})
        .then((response)=>{
            const length = Object.keys(response.data.expense).length;
            for(let i=0;i<length;i++){
                const data = response.data.expense[i];
                console.log(data);
                addUser(data);
            }
    })
}

window.addEventListener('load',()=>{
    displayExpenses();
})
