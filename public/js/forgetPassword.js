// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm';

const forgetPasswordForm = document.getElementById('forget-password-form');
const email = document.getElementById('forget-password-email');

forgetPasswordForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const userdata = {
        email:email.value
    }

    sendEmail(userdata);
    forgetPasswordForm.reset();
})

async function sendEmail(userdata){
    try {
        const response = axios.post('/forgetPassword',userdata);
    } catch (error) {
        console.error("Error sending request", error.message);
    }
}
