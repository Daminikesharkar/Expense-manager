import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const form = document.getElementById('login');

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');


function loginUser(userData){
    axios.post('/login',userData)
        .then((response)=>{
            const userId = response.data.user.id;
            console.log("Logged in!",response)
            window.location.href = `/userExpenses?userId=${userId}`;
        }).catch((error)=>{
            console.log(error);
        })
}

form.addEventListener("submit",(event)=>{
    event.preventDefault()

    const userData ={
        username: username.value,
        email: email.value,
        password: password.value
    }

    loginUser(userData);
    form.reset();
})
