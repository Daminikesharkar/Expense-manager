import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'
// const Razorpay = require('razorpay');

const form = document.getElementById('expenseForm');

const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');


const premium = document.getElementById('premium');
premium.addEventListener('click', ()=>{
    const token = localStorage.getItem('token');
    console.log(token);
    axios.get('/buyPremium',{headers:{"Authorization":token}})
        .then((response)=>{
            console.log(response.data)
            if (!response.data.key_id) {
                throw new Error("No key_id found in the response");
            }
            const options = {
                "key": response.data.key_id,
                "order_id": response.data.orderId,
                "amount":response.data.amount,
                "handler": async function (response) {

                    const transactionStatus= await axios.post('/updateTransaction',{
                        order_id : response.razorpay_order_id,
                        payment_id:response.razorpay_payment_id,
                    },{headers:{"Authorization":token}});
                    
                    alert(transactionStatus.data.msg);
                    document.getElementById("premium").style.visibility = "hidden";
                    document.getElementById("message").innerHTML="You are a premium user";

                    localStorage.setItem('token',transactionStatus.data.token);
                },
            }

            var razorpay = new Razorpay(options);
            razorpay.open();
            
            razorpay.on('payment.failed', function (response) {
                console.log(response);
                alert('Something went wrong Transaction failed');
    
            });
        })
        .catch(error=>{
            console.log(error);
        })
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

function deleteExpense(id){
    const token = localStorage.getItem('token');
    axios.get('/deleteExpense'+`/${id}`,{headers:{"Authorization":token}})
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
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('load',()=>{
    displayExpenses();

    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    if(decoded.ispremiumuser){
        document.getElementById("premium").style.visibility = "hidden";
        document.getElementById("message").innerHTML="You are a premium user";
    }
})
