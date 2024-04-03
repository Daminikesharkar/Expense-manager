import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

//Pop up signin and signup forms
const signInButton = document.querySelector(".signin");
const signUpButton = document.querySelector(".signup");
const loginPopup = document.getElementById("login-popup");
const signupPopup = document.getElementById("signup-popup");
const joinNowButton = document.querySelector(".join"); 

signInButton.addEventListener("click", function() {
    loginPopup.style.display = "block";
});

signUpButton.addEventListener("click", function() {
    signupPopup.style.display = "block";
});

joinNowButton.addEventListener("click", function(event) {
    event.preventDefault(); 
    signupPopup.style.display = "block";
});

document.querySelectorAll(".close-popup").forEach(function(closeButton) {
    closeButton.addEventListener("click", function() {
        this.closest(".popup").style.display = "none";
    });
});

window.addEventListener("click", function(event) {
    if (event.target.classList.contains("popup")) {
        event.target.style.display = "none";
    }
});

//Sign up Logic
const signupform = document.getElementById('signup-form');

const username = document.getElementById('signup-username');
const email = document.getElementById('signup-email');
const password = document.getElementById('signup-password');


function postData(userData){
    axios.post('/addUser',userData)
        .then((response)=>{
            console.log("user successfully added!",response.data.message);
            alert('Sign up completed! Now login');
        }).catch((error)=>{
            console.log(error);
        })
}

signupform.addEventListener("submit",(event)=>{
    event.preventDefault()

    const userData ={
        username: username.value,
        email: email.value,
        password: password.value
    }

    postData(userData);
    console.log(userData);
    form.reset();
})


//Login Logic
const loginForm = document.getElementById('login-form');
const forgetPassword = document.getElementById('forget-password');


const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');


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

loginForm.addEventListener("submit",(event)=>{
    event.preventDefault()

    const userData ={
        email: loginEmail.value,
        password: loginPassword.value
    }

    loginUser(userData);
    loginForm.reset();
})