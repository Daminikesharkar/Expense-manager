const showLeaderboardButton = document.querySelector(".show-leaderboard");
const downloadReportsButton = document.querySelector(".download-reports");
const leaderboardTable = document.getElementById("leaderboard-div");
const downloadButton = document.getElementById("download-div");

showLeaderboardButton.addEventListener("click", function() {
    leaderboardTable.style.display = "table";
    downloadButton.style.display = "none";
});

downloadReportsButton.addEventListener("click", function() {
    leaderboardTable.style.display = "none";
    downloadButton.style.display = "block";
});

document.addEventListener("DOMContentLoaded", function() {
    const buyPremiumButton = document.querySelector('.subscribe-button');
    const heroSection = document.querySelector('.hero-section');
    const premiumFeaturesContainer = document.querySelector('.premium-features-container');

    buyPremiumButton.addEventListener('click', function(event) {
        event.preventDefault();
        heroSection.style.display = 'none';
        premiumFeaturesContainer.style.display = 'block';
    });
});