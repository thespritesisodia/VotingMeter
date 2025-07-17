// Data structure for profiles, groups, and candidates
const profiles = {
    captain: {
        name: 'School Captain',
        groups: {
            A: [
                { id: 'c1', name: 'Bhoomi Sharma', photo: 'photos/Bhoomi.jpeg' },
                { id: 'c2', name: 'Shahid', photo: 'photos/Shahid.jpeg' }
            ],
            B: [
                { id: 'c3', name: 'Sneha Nigam', photo: 'photos/Sneha.jpeg' },
                { id: 'c4', name: 'Rohit Bharadwaj', photo: 'https://via.placeholder.com/90x90.png?text=Photo' }
            ]
        }
    },
    vice: {
        name: 'Vice Captain',
        groups: {
            A: [
                { id: 'v1', name: 'Vanshika Pathak', photo: 'photos/Vanshika.jpeg' },
                { id: 'v2', name: 'Devansh Singh', photo: 'photos/Devansh.jpeg' }
            ],
            B: [
                { id: 'v3', name: 'Shalu Sharma', photo: 'photos/Shalu.jpeg' },
                { id: 'v4', name: 'Vikram Jana', photo: 'photos/Vikram Jana.jpeg' }
            ]
        }
    }
};

let selectedProfile = null;
let selectedGroup = null;
let teacherTitle = '';
let teacherName = '';

// Handle teacher landing form
const teacherForm = document.getElementById('teacher-form');
if (teacherForm) {
    teacherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const titleSelect = document.getElementById('teacher-title');
        const input = document.getElementById('teacher-name');
        teacherTitle = titleSelect.value;
        teacherName = input.value.trim();
        if (teacherTitle && teacherName) {
            localStorage.setItem('teacherTitle', teacherTitle);
            localStorage.setItem('teacherName', teacherName);
            showSection('profile-selection');
        } else {
            if (!teacherTitle) titleSelect.focus();
            else input.focus();
        }
    });
}

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
    renderGroupFlowChart();
    showSection('group-selection');
}

function renderGroupFlowChart() {
    const chart = document.getElementById('group-flow-chart');
    if (!selectedProfile || !chart) {
        chart.innerHTML = '';
        return;
    }
    const profile = profiles[selectedProfile];
    // Build the flow chart HTML
    let html = `<div class='flow-profile'>${profile.name}</div>`;
    html += `<div class='flow-groups-row'>`;
    ['A', 'B'].forEach(groupKey => {
        html += `<div class='flow-group-box'>
            <div class='flow-group-title'>Group ${groupKey}</div>
            <svg class='flow-vertical-arrow' width='24' height='36' viewBox='0 0 24 36'>
                <defs>
                    <marker id='v-arrowhead-${groupKey}' markerWidth='6' markerHeight='6' refX='3' refY='5' orient='auto'>
                        <polygon points='0 0, 6 3, 3 6' fill='#6a82fb'/>
                    </marker>
                </defs>
                <line x1='12' y1='0' x2='12' y2='30' stroke='#6a82fb' stroke-width='3' marker-end='url(#v-arrowhead-${groupKey})'/>
            </svg>`;
        profile.groups[groupKey].forEach(candidate => {
            html += `<span class='flow-candidate-name'>${candidate.name}</span>`;
        });
        html += `</div>`;
    });
    html += `</div>`;
    chart.innerHTML = html;
}

function selectGroup(groupKey) {
    selectedGroup = groupKey;
    showGroupCandidates();
    showSection('candidate-voting');
}

function showGroupCandidates() {
    const groupTitle = document.getElementById('candidate-group-title');
    const candidatesList = document.getElementById('candidates-list');
    const profile = profiles[selectedProfile];
    const groupCandidates = profile.groups[selectedGroup];
    groupTitle.textContent = `${profile.name} - Group ${selectedGroup}`;
    candidatesList.innerHTML = '';
    // Show candidate photos and names side by side
    const card = document.createElement('div');
    card.className = 'candidate-card';
    let candidatesHtml = '<div class="group-candidates-row">';
    groupCandidates.forEach(candidate => {
        candidatesHtml += `
            <div class="group-candidate-box">
                <img src="${candidate.photo}" alt="${candidate.name}" class="group-candidate-photo" />
                <div class="group-candidate-name">${candidate.name}</div>
            </div>
        `;
    });
    candidatesHtml += '</div>';
    card.innerHTML = `
        <div>
            <div class="candidate-name" style="font-size:1.2em;font-weight:700;">Group ${selectedGroup}</div>
            ${candidatesHtml}
        </div>
        <button class="vote-btn" onclick="voteGroup('${selectedGroup}')">Vote</button>
    `;
    candidatesList.appendChild(card);
}

function showCandidates() {
    const groupTitle = document.getElementById('candidate-group-title');
    const candidatesList = document.getElementById('candidates-list');
    const profile = profiles[selectedProfile];
    groupTitle.textContent = `${profile.name} - Select Group`;
    candidatesList.innerHTML = '';
    // Show only Group A and Group B as voting options
    ['A', 'B'].forEach(groupKey => {
        const groupCandidates = profile.groups[groupKey];
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:18px;">
                <div>
                    <div class="candidate-name" style="font-size:1.2em;font-weight:700;">Group ${groupKey}</div>
                    <div style="font-size:0.98em;color:#ccc;">${groupCandidates.map(c => c.name).join(', ')}</div>
                </div>
            </div>
            <button class="vote-btn" onclick="voteGroup('${groupKey}')">Vote</button>
        `;
        candidatesList.appendChild(card);
    });
}

function voteGroup(groupKey) {
    const title = localStorage.getItem('teacherTitle') || '';
    const name = localStorage.getItem('teacherName') || '';
    const profile = selectedProfile;
    // Prevent double voting for the same profile
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    const alreadyVoted = votes.some(v => v.teacherTitle === title && v.teacherName === name && v.profile === profile);
    if (alreadyVoted) {
        alert('You have already voted for this profile!');
        return;
    }
    // Store the vote (for group)
    votes.push({
        teacherTitle: title,
        teacherName: name,
        profile: profile,
        group: groupKey
    });
    localStorage.setItem('votes', JSON.stringify(votes));
    // Show thank you message
    const thankyouMsg = document.getElementById('thankyou-message');
    if (thankyouMsg) {
        thankyouMsg.textContent = `Thank You ${title} ${name} for your precious vote!`;
    }
    showSection('vote-confirmation');
}

function goBackToProfile() {
    showSection('profile-selection');
}

function goBackToGroup() {
    showSection('group-selection');
}

function goToHome() {
    // Always hide the final results modal if open
    const finalModal = document.getElementById('final-results-modal');
    if (finalModal) finalModal.classList.add('hidden-section');
    showSection('teacher-landing');
}

let passwordModalCallback = null;
let passwordModalPurpose = '';

function openPasswordModal(purpose, callback) {
    passwordModalPurpose = purpose;
    passwordModalCallback = callback;
    document.getElementById('password-modal-input').value = '';
    document.getElementById('password-modal-error').style.display = 'none';
    document.getElementById('password-modal').classList.remove('hidden-section');
    document.getElementById('password-modal-title').textContent = purpose === 'results' ? 'Enter Results Password' : 'Enter Reset Password';
    setTimeout(() => {
        document.getElementById('password-modal-input').focus();
    }, 100);
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden-section');
    passwordModalCallback = null;
    passwordModalPurpose = '';
}

function confirmPasswordModal() {
    const input = document.getElementById('password-modal-input').value;
    const errorDiv = document.getElementById('password-modal-error');
    errorDiv.style.display = 'none';
    if (passwordModalPurpose === 'results') {
        if (input !== 'Sprite@12345') {
            errorDiv.textContent = 'Incorrect password!';
            errorDiv.style.display = 'block';
            return;
        }
    } else if (passwordModalPurpose === 'reset') {
        if (input !== 'Sprite@1109') {
            errorDiv.textContent = 'Incorrect password!';
            errorDiv.style.display = 'block';
            return;
        }
    }
    closePasswordModal();
    if (passwordModalCallback) passwordModalCallback();
}

function showResults() {
    openPasswordModal('results', showResultsUnlocked);
}

function showResultsUnlocked() {
    // Prepare results
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    const resultsList = document.getElementById('results-list');
    if (!resultsList) return;

    // Build a table of all votes
    let tableHtml = `<div style='overflow-x:auto;'><table style='width:100%;border-collapse:collapse;background:#181828;color:#fff;border-radius:12px;box-shadow:0 2px 12px #0003;margin:1.5em 0;'>`;
    tableHtml += `<thead><tr style='background:#fc5c7d;color:#fff;'><th style='padding:12px 8px;'>Teacher</th><th style='padding:12px 8px;'>Profile</th><th style='padding:12px 8px;'>Group</th><th style='padding:12px 8px;'>Candidate</th></tr></thead><tbody>`;
    if (votes.length === 0) {
        tableHtml += `<tr><td colspan='4' style='text-align:center;padding:18px;color:#ccc;'>No votes yet.</td></tr>`;
    } else {
        votes.forEach(vote => {
            // Find candidate name
            let candidateName = vote.candidateId;
            Object.keys(profiles).forEach(profileKey => {
                const profile = profiles[profileKey];
                Object.keys(profile.groups).forEach(groupKey => {
                    profile.groups[groupKey].forEach(candidate => {
                        if (candidate.id === vote.candidateId) {
                            candidateName = candidate.name;
                        }
                    });
                });
            });
            // Profile display name
            let profileDisplay = profiles[vote.profile]?.name || vote.profile;
            tableHtml += `<tr style='border-bottom:1px solid #333;'>
                <td style='padding:10px 8px;'>${vote.teacherTitle} ${vote.teacherName}</td>
                <td style='padding:10px 8px;'>${profileDisplay}</td>
                <td style='padding:10px 8px;'>Group ${vote.group}</td>
                <td style='padding:10px 8px;'>${candidateName || '-'}</td>
            </tr>`;
        });
    }
    tableHtml += `</tbody></table></div>`;

    // Only show the table in the results-flex-container
    resultsList.innerHTML = `
        <div class="results-flex-container">
            <div class="results-table-box">${tableHtml}</div>
        </div>
        <div class="results-btn-row">
            <button class="vote-btn" style="font-size:1.1em;padding:12px 28px;" onclick="showFinalResults()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:8px;"><path d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2M21 5a3 3 0 0 1-3 3c-1.5 0-3-1.5-3-3M3 5a3 3 0 0 0 3 3c1.5 0 3-1.5 3-3"/><path d="M17 5a5 5 0 0 1-10 0"/></svg>
                Final Results
            </button>
            <button class="vote-btn red" style="font-size:1.1em;padding:12px 28px;" onclick="resetResults()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:8px;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Reset Results
            </button>
        </div>
    `;
    showSection('results-page');
}

function resetResults() {
    openPasswordModal('reset', resetResultsUnlocked);
}

function resetResultsUnlocked() {
    localStorage.removeItem('votes');
    alert('Results have been reset!');
    location.reload();
}

function showFinalResults() {
    // Gather votes
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    // Count votes per group for each profile
    const groupVotes = {
        captain: { A: 0, B: 0 },
        vice: { A: 0, B: 0 }
    };
    votes.forEach(vote => {
        if (groupVotes[vote.profile] && groupVotes[vote.profile][vote.group] !== undefined) {
            groupVotes[vote.profile][vote.group]++;
        }
    });
    // Determine winning group for each profile
    const winners = {
        captain: groupVotes.captain.A >= groupVotes.captain.B ? 'A' : 'B',
        vice: groupVotes.vice.A >= groupVotes.vice.B ? 'A' : 'B'
    };
    // Build winners HTML
    let html = '<div class="final-winners-flex">';
    ['captain', 'vice'].forEach(profileKey => {
        const profile = profiles[profileKey];
        const groupKey = winners[profileKey];
        const groupCandidates = profile.groups[groupKey];
        html += `
            <div class='final-winner-card'>
                <div class="final-winner-congrats">🎉 Congratulations!</div>
                <div class="final-winner-profile">${profile.name} - Group ${groupKey}</div>
                <div class="final-winner-name">${groupCandidates.map(c => c.name).join(', ')}</div>
                <div style="color:#4BB543;font-size:1.1em;margin-top:0.5em;">Total Votes: ${groupVotes[profileKey][groupKey]}</div>
            </div>
        `;
    });
    html += '</div>';
    document.getElementById('final-winners-list').innerHTML = html;
    document.getElementById('final-results-modal').classList.remove('hidden-section');
}

function closeFinalResults() {
    document.getElementById('final-results-modal').classList.add('hidden-section');
}

// Start at teacher landing
showSection('teacher-landing'); 