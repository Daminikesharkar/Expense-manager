// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

//Pop up signin and signup forms
const signInButton = document.querySelector(".signin");
const signUpButton = document.querySelector(".signup");
const loginPopup = document.getElementById("login-popup");
const signupPopup = document.getElementById("signup-popup");
const joinNowButton = document.querySelector(".join"); 

signInButton.addEventListener("click", ()=>{
    loginPopup.style.display = "block";
});

signUpButton.addEventListener("click", ()=> {
    signupPopup.style.display = "block";
});

joinNowButton.addEventListener("click", (event)=> {
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

async function postData(userData) {
    try {
        const response = await axios.post('/addUser', userData,{
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.status === 200) {
            alert("Signed Up successfully, please login now!");
            console.log("User successfully added!");
            window.location.href = `/`;
        }else if(response.status === 400) {
            alert(response.data.message);
            throw new Error("User already exists with this email" + response.status);
        }else {
            alert(response.data.message)
            throw new Error("Failed to add user" + response.status);
        }

    } catch (error) {
        console.error("Error adding User", error.message);
    }
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
    signupform.reset();
})


//Login Logic
const loginForm = document.getElementById('login-form');
const forgetPassword = document.getElementById('forget-password');


const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

async function loginUser(userData) {
    try {
        const response = await axios.post('/login', userData, {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            // window.location.href = `/userExpenses?userId=${userId}`;
            window.location.href = `/userExpenses`;

        }else if(response.status === 400) {
            console.log(response.data.message);
            alert(response.data.message)
            throw new Error("Failed to log In:" + response.data.message);
        }else if(response.status === 401) {
            console.log(response.data.message);
            alert(response.data.message)
            throw new Error("Failed to log In:" + response.data.message);
        }

    } catch (error) {
        console.error("Error logging User", error.message);
    }
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

//forget password logic 
const forgetPasswordLink = document.getElementById('forget-password');

forgetPasswordLink.addEventListener('click',async (e)=>{
    e.preventDefault();
    window.location.href = `/forgetPasswordpage`;
})