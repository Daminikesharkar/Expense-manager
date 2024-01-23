import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const form = document.getElementById('signup');

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');


function postData(userData){
    axios.post('/addUser',userData)
        .then((response)=>{
            console.log("user successfully added!")
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

    postData(userData);
    form.reset();
})
