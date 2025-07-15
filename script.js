// Data structure for profiles, groups, and candidates
const profiles = {
    captain: {
        name: 'School Captain',
        groups: {
            A: [
                { id: 'c1', name: 'Alice' },
                { id: 'c2', name: 'Bob' }
            ],
            B: [
                { id: 'c3', name: 'Carol' },
                { id: 'c4', name: 'Dave' }
            ]
        }
    },
    vice: {
        name: 'Vice Captain',
        groups: {
            A: [
                { id: 'v1', name: 'Eve' },
                { id: 'v2', name: 'Frank' }
            ],
            B: [
                { id: 'v3', name: 'Grace' },
                { id: 'v4', name: 'Heidi' }
            ]
        }
    }
};

let selectedProfile = null;
let selectedGroup = null;

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
    document.getElementById(sectionId).classList.remove('hidden-section');
}

function selectProfile(profileKey) {
    selectedProfile = profileKey;
    showSection('group-selection');
}

function selectGroup(groupKey) {
    selectedGroup = groupKey;
    showCandidates();
    showSection('candidate-voting');
}

function showCandidates() {
    const groupTitle = document.getElementById('candidate-group-title');
    const candidatesList = document.getElementById('candidates-list');
    const profile = profiles[selectedProfile];
    const candidates = profile.groups[selectedGroup];
    groupTitle.textContent = `${profile.name} - Group ${selectedGroup}`;
    candidatesList.innerHTML = '';
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <span class="candidate-name">${candidate.name}</span>
            <button onclick="voteCandidate('${candidate.id}')">Vote</button>
        `;
        candidatesList.appendChild(card);
    });
}

function voteCandidate(candidateId) {
    // Voting logic will be added later
    showSection('vote-confirmation');
}

function goBackToProfile() {
    showSection('profile-selection');
}

function goBackToGroup() {
    showSection('group-selection');
}

function goToHome() {
    showSection('profile-selection');
}

function showResults() {
    // Results logic will be added later
    showSection('results-page');
}

// Start at home
showSection('profile-selection'); 