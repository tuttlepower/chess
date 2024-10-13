document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('eloChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Player 1 Elo Distribution',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true
                },
                {
                    label: 'Player 2 Elo Distribution',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                    fill: true
                }
            ]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Elo Rating', color: '#FFFFFF' } },
                y: { title: { display: true, text: 'Probability Density', color: '#FFFFFF' }, beginAtZero: true }
            },
            plugins: { legend: { labels: { color: '#FFFFFF' } } },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    let timeControl = 'blitz';

    document.getElementById('timeControlSelect').addEventListener('change', (e) => {
        timeControl = e.target.value;
    });

    document.getElementById('updateButton').addEventListener('click', async () => {
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        if (!player1Name || !player2Name) {
            alert('Please enter both player usernames.');
            return;
        }

        try {
            const [player1, player2] = await Promise.all([getPlayerData(player1Name), getPlayerData(player2Name)]);
            updateChart(player1, player2);
        } catch (error) {
            console.error('Error fetching player data:', error);
            alert('Failed to fetch player data. Please check the usernames and try again.');
        }
    });

    async function getPlayerData(username) {
        const response = await fetch(`https://lichess.org/api/user/${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const elo = data.perfs[timeControl]?.rating || 0;
        const numberOfGames = data.perfs[timeControl]?.games || 0;

        return { username: data.username, elo, numberOfGames };
    }

    function calculateWinProbability(elo1, elo2) {
        const prob1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
        return [prob1, 1 - prob1];
    }

    function updateChart(player1, player2) {
        const minElo = Math.min(player1.elo, player2.elo) - 400;
        const maxElo = Math.max(player1.elo, player2.elo) + 400;
        const eloRange = Array.from({ length: Math.round(maxElo - minElo) }, (_, i) => i + Math.round(minElo));

        const player1Dist = gaussianDistribution(player1.elo, 200, eloRange);
        const player2Dist = gaussianDistribution(player2.elo, 200, eloRange);

        chart.options.scales.x.min = Math.round(minElo);
        chart.options.scales.x.max = Math.round(maxElo);
        chart.data.labels = eloRange;
        chart.data.datasets[0].data = player1Dist;
        chart.data.datasets[1].data = player2Dist;
        chart.update();

        const [player1WinProb, player2WinProb] = calculateWinProbability(player1.elo, player2.elo);
        document.getElementById('player1Stats').innerHTML = `<strong>${player1.username}</strong><br>Elo: ${player1.elo}`;
        document.getElementById('player2Stats').innerHTML = `<strong>${player2.username}</strong><br>Elo: ${player2.elo}`;
        document.getElementById('winProb').innerHTML = `${player1.username}: ${(player1WinProb * 100).toFixed(2)}%<br>${player2.username}: ${(player2WinProb * 100).toFixed(2)}%`;
    }

    function gaussianDistribution(mean, stdDev, range) {
        return range.map(x => {
            const exponent = Math.exp(-((x - mean) ** 2) / (2 * stdDev ** 2));
            return exponent / (stdDev * Math.sqrt(2 * Math.PI));
        });
    }
});