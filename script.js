// Initial Data based on the Java Application
const voters = [
    { id: 101, name: "Sharan", voted: false },
    { id: 102, name: "Srimathy", voted: false },
    { id: 103, name: "Fareedh", voted: false },
    { id: 104, name: "Reshma", voted: false },
    { id: 105, name: "Gokul", voted: false },
    { id: 106, name: "Kaviya", voted: false },
    { id: 107, name: "Manoj", voted: false },
    { id: 108, name: "Andrika", voted: false },
    { id: 109, name: "Shyam", voted: false },
    { id: 110, name: "Pooja", voted: false }
];

const candidates = [
    { name: "TVK", votes: 0, image: "assets/tvk.jpg" },
    { name: "DMK", votes: 0, image: "assets/dmk.jpg" },
    { name: "ADMK", votes: 0, image: "assets/admk.png" },
    { name: "NTK", votes: 0, image: "assets/ntk.png" },
    { name: "NOTA", votes: 0, image: "assets/nota.jpg" }
];

// State Management
let currentVoterIndex = -1;

// DOM Elements
const navVoteBtn = document.getElementById('nav-vote');
const navResultsBtn = document.getElementById('nav-results');

const loginSection = document.getElementById('login-section');
const votingSection = document.getElementById('voting-section');
const resultsSection = document.getElementById('results-section');

const loginBtn = document.getElementById('login-btn');
const voterIdInput = document.getElementById('voter-id');
const loginError = document.getElementById('login-error');

const voterNameSpan = document.getElementById('voter-name');
const candidatesGrid = document.getElementById('candidates-grid');
const votingArea = document.getElementById('voting-area');
const alreadyVotedMsg = document.getElementById('already-voted');
const voteSuccessMsg = document.getElementById('vote-success');
const logoutBtn = document.getElementById('logout-btn');

const resultsTbody = document.getElementById('results-tbody');
const winnerAnnouncement = document.getElementById('winner-announcement');

// Navigation Logic
function showSection(sectionId) {
    [loginSection, votingSection, resultsSection].forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });

    document.getElementById(sectionId).classList.remove('hidden-section');
    document.getElementById(sectionId).classList.add('active-section');

    // Update nav buttons
    navVoteBtn.classList.toggle('active', sectionId !== 'results-section');
    navResultsBtn.classList.toggle('active', sectionId === 'results-section');
}

navVoteBtn.addEventListener('click', () => {
    if (currentVoterIndex !== -1) {
        showSection('voting-section');
    } else {
        showSection('login-section');
    }
});

navResultsBtn.addEventListener('click', () => {
    updateResults();
    showSection('results-section');
});

// Authentication Logic
loginBtn.addEventListener('click', authenticate);
voterIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') authenticate();
});

function authenticate() {
    const enteredId = parseInt(voterIdInput.value);

    const index = voters.findIndex(v => v.id === enteredId);

    if (index === -1) {
        loginError.classList.remove('hidden');
        loginError.textContent = "Invalid Voter ID. Please try again.";
        return;
    }

    loginError.classList.add('hidden');
    currentVoterIndex = index;
    voterIdInput.value = '';

    setupVotingPanel();
    showSection('voting-section');
}

// Voting Logic
function setupVotingPanel() {
    const voter = voters[currentVoterIndex];
    voterNameSpan.textContent = voter.name;

    if (voter.voted) {
        votingArea.classList.add('hidden');
        voteSuccessMsg.classList.add('hidden');
        alreadyVotedMsg.classList.remove('hidden');
    } else {
        alreadyVotedMsg.classList.add('hidden');
        voteSuccessMsg.classList.add('hidden');
        votingArea.classList.remove('hidden');
        renderCandidates();
    }
}

function renderCandidates() {
    candidatesGrid.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.setAttribute('data-party', candidate.name);

        card.innerHTML = `
            <img src="${candidate.image}" alt="${candidate.name} Logo" class="candidate-logo">
            <h3>${candidate.name}</h3>
            <p>Click to vote</p>
        `;

        card.addEventListener('click', () => castVote(index));
        candidatesGrid.appendChild(card);
    });
}

function castVote(candidateIndex) {
    if (currentVoterIndex === -1 || voters[currentVoterIndex].voted) return;

    // Record Vote
    candidates[candidateIndex].votes++;
    voters[currentVoterIndex].voted = true;

    // Update UI
    votingArea.classList.add('hidden');
    voteSuccessMsg.classList.remove('hidden');
}

// Logout
logoutBtn.addEventListener('click', () => {
    currentVoterIndex = -1;
    showSection('login-section');
});

// Results Logic
function updateResults() {
    // Find max votes
    let maxVotes = 0;
    let winnerIndex = 0;
    let totalVotes = 0;

    candidates.forEach((candidate, index) => {
        totalVotes += candidate.votes;
        if (candidate.votes > maxVotes) {
            maxVotes = candidate.votes;
            winnerIndex = index;
        }
    });

    // Announce Winner
    if (totalVotes === 0) {
        winnerAnnouncement.innerHTML = `
            <h3>No votes cast yet</h3>
            <p class="votes">Waiting for results...</p>
        `;
    } else {
        winnerAnnouncement.innerHTML = `
            <h3>Leading: ${candidates[winnerIndex].name}</h3>
            <p class="votes">${maxVotes} votes</p>
        `;
    }

    // Render Table
    resultsTbody.innerHTML = '';

    // Sort candidates by votes (descending)
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach((candidate, index) => {
        const percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
        let resultText = '-';
        let statusClass = 'status-trailing';

        if (totalVotes > 0) {
            if (candidate.votes === maxVotes) {
                resultText = 'Leading';
                statusClass = 'status-leading';
                if (totalVotes === voters.length) {
                    resultText = 'Winner';
                    statusClass = 'status-winner';
                }
            } else {
                resultText = 'Trailing';
            }
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${candidate.image}" alt="${candidate.name} Logo" class="result-party-logo">
                ${candidate.name}
            </td>
            <td>${candidate.votes}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div class="party-${candidate.name}" style="height: 100%; width: ${percentage}%;"></div>
                    </div>
                    <span style="width: 40px; text-align: right;">${percentage}%</span>
                </div>
            </td>
            <td class="result-status ${statusClass}">${resultText}</td>
        `;

        resultsTbody.appendChild(tr);
    });
}
