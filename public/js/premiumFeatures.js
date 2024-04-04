import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.1/+esm'

const showLeaderboardButton = document.querySelector(".show-leaderboard");
const downloadReportsButton = document.querySelector(".download-reports");
const leaderboardTable = document.getElementById("leaderboard-div");
const downloadButton = document.getElementById("download-div");
const premiumText = document.getElementById('Premium-user-text');

const heroSection = document.querySelector('.hero-section');
const premiumFeaturesContainer = document.querySelector('.premium-features-container');
const downloadReports = document.getElementById('download-button');
const downloadReportsHistory = document.getElementById('download-history-button');
const historytableContainer = document.getElementById('history-url');

showLeaderboardButton.addEventListener("click", ()=> {
    leaderboardTable.style.display = "table";
    downloadButton.style.display = "none";
    showLeaderboardData();
});

downloadReportsButton.addEventListener("click", ()=> {
    leaderboardTable.style.display = "none";
    downloadButton.style.display = "block";
    historytableContainer.style.display = 'none';
});

const premium = document.getElementById('premium-button');
premium.addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get('/buyPremium', {headers: {"Authorization": token}});

        const options = {
            "key": response.data.key_id,
            "order_id": response.data.orderId,
            "amount": response.data.amount,
            "handler": async function (response) {
                try {
                    const transactionStatus = await axios.post('/updateTransaction', {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {headers: {"Authorization": token}});

                    alert(transactionStatus.data.msg);
                    heroSection.style.display = 'none';
                    premiumFeaturesContainer.style.display = 'block';

                    localStorage.setItem('token', transactionStatus.data.token);
                } catch (error) {
                    console.error("Error updating transaction", error.message);
                }
            },
        }

        var razorpay = new Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong. Transaction failed');
        });

    } catch (error) {
        console.error("Error buying premium", error.message);
    }
});

async function showLeaderboardData() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/showLeaderboard', { headers: { "Authorization": token } });

        const leaderboardTableBody = document.querySelector('#leaderboard tbody');
        leaderboardTableBody.innerHTML = ''; 

        const length = Object.keys(response.data.userData).length;
        for (let i = 0; i < length; i++) {
            const userDetails = response.data.userData[i];
            const row = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${userDetails.username}</td>
                    <td>${userDetails.total_expenses}</td>
                </tr>`;
            leaderboardTableBody.innerHTML += row;
        }
    } catch (error) {
        console.error("Error showing leaderboard", error.message);
    }
}

downloadReports.addEventListener('click',async (e)=>{
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/downloadFile`,{headers:{"Authorization":token}})

        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileurl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }
        
    } catch (error) {
        console.error("Error downloading file", error.message);
    }

});
downloadReportsHistory.addEventListener('click',async (e)=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/downloadHistory',{headers:{"Authorization":token}});
        addUrlsToUI(response.data.history);
        
    } catch (error) {
        console.error("Error showing history", error.message);
    }
});

function addUrlsToUI(urls){

    historytableContainer.style.display = 'block';

    const tableBody = document.querySelector('.history-url-table tbody');
   
    tableBody.innerHTML = '';

    const length = Object.keys(urls).length;

    for(let i=0;i<length;i++){
        const url = urls[i];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i+1}</td>
            <td><a href="${url.downloadUrl}">myDownload-${url.createdAt}</a></td>
        `;
    
        tableBody.appendChild(row);        
    }
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