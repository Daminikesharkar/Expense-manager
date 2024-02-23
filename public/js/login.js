import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const form = document.getElementById('login');
const forgetPassword = document.getElementById('forget-password');

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');


function loginUser(userData){
    axios.post('/login',userData)
        .then((response)=>{
            localStorage.setItem('token',response.data.token);
            // window.location.href = `/userExpenses?userId=${userId}`;
            window.location.href = `/userExpenses`;
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

function resetPassword(userData){
    axios.post('/password/resetpassword',userData)        
        .then((response)=>{
            closeForm();
        })
        .catch((error)=>{
            console.log(error)
        })    
}

forgetPassword.addEventListener("click",(e)=>{
    openForm();
    const userEmail = document.getElementById('resetemail').value;
    const submitLinkForm = document.getElementById('passwordResetForm');

    submitLinkForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        console.log("submit1")
        const userData ={
            userEmail: userEmail.value,
        }
        resetPassword(userData);
        closeForm();
    })
})

function openForm() {
    document.getElementById("forgotPasswordForm").style.display = "block";
  }
  
function closeForm() {
    document.getElementById("forgotPasswordForm").style.display = "none";
}