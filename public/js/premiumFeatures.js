import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const showLeaderboardButton = document.querySelector(".show-leaderboard");
const downloadReportsButton = document.querySelector(".download-reports");
const leaderboardTable = document.getElementById("leaderboard-div");
const downloadButton = document.getElementById("download-div");
const premiumText = document.getElementById('Premium-user-text');

const heroSection = document.querySelector('.hero-section');
const premiumFeaturesContainer = document.querySelector('.premium-features-container');

showLeaderboardButton.addEventListener("click", function() {
    leaderboardTable.style.display = "table";
    downloadButton.style.display = "none";
    showLeaderboardData();
});

downloadReportsButton.addEventListener("click", function() {
    leaderboardTable.style.display = "none";
    downloadButton.style.display = "block";
    downloadExpenses();
});

const premium = document.getElementById('premium-button');
premium.addEventListener('click', (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('token');

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
                    heroSection.style.display = 'none';
                    premiumFeaturesContainer.style.display = 'block';

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

function showLeaderboardData(){
    const token = localStorage.getItem('token');
    axios.get('/showLeaderboard',{headers:{"Authorization":token}})
        .then((response)=>{

            const leaderboardTableBody = document.querySelector('#leaderboard tbody');
            leaderboardTableBody.innerHTML = ''; 


            const length = Object.keys(response.data.userData).length;
            for(let i=0;i<length;i++){
                const userDetails = response.data.userData[i];
                const row = `
                    <tr>
                        <td>${i+1}</td>
                        <td>${userDetails.username}</td>
                        <td>${userDetails.total_expenses}</td>
                    </tr>`;
                leaderboardTableBody.innerHTML += row;
                
            }            
        })
        .catch((error)=>{
            console.log(error);
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
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);

    if(decoded.ispremiumuser){
        heroSection.style.display = 'none';
        premiumFeaturesContainer.style.display = 'block';
        premiumText.style.display = 'block'
    }else{
        heroSection.style.display = 'block';
        premiumFeaturesContainer.style.display = 'none';
        premiumText.style.display = 'none'
    }
})