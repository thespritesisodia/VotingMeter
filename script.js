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
        const passwordModal = document.getElementById('password-modal');
        if (passwordModal && !passwordModal.classList.contains('hidden-section')) {
            e.preventDefault();
            return false;
        }
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
        if (candidate.name === 'Rohit Bharadwaj' || candidate.id === 'c4') {
            candidatesHtml += `
                <div class="group-candidate-box">
                    <div class="group-candidate-initial" title="Rohit Bharadwaj">R</div>
                    <div class="group-candidate-name">${candidate.name}</div>
                </div>
            `;
        } else {
            candidatesHtml += `
                <div class="group-candidate-box">
                    <img src="${candidate.photo}" alt="${candidate.name}" class="group-candidate-photo" />
                    <div class="group-candidate-name">${candidate.name}</div>
                </div>
            `;
        }
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

function resetVotes() {
    localStorage.removeItem('votes');
    openResultsModal(); // Refresh the table
    alert('All votes have been reset!');
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
        const passwordInput = document.getElementById('password-modal-input');
        if (passwordInput) {
            passwordInput.onkeydown = null;
            passwordInput.addEventListener('keydown', function handler(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    confirmPasswordModal();
                }
            }, { once: true });
        }
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
    // DEBUG: Log the entered and expected password
    console.log('Entered password:', JSON.stringify(input));
    if (passwordModalPurpose === 'results') {
        console.log('Expected password:', 'Sprite@12345');
        if (input !== 'Sprite@12345') {
            errorDiv.textContent = 'Incorrect password!';
            errorDiv.style.display = 'block';
            return;
        }
    } else if (passwordModalPurpose === 'reset') {
        console.log('Expected password:', 'Sprite@1109');
        if (input !== 'Sprite@1109') {
            errorDiv.textContent = 'Incorrect password!';
            errorDiv.style.display = 'block';
            return;
        }
    }
    closePasswordModal();
    if (passwordModalCallback) passwordModalCallback();
}

function openResultsModal() {
    // Prompt for password before showing results
    const password = prompt('Enter results password:');
    if (password !== 'Sprite@123') {
        alert('Incorrect password!');
        return;
    }
    const modal = document.getElementById('results-modal');
    const tableDiv = document.getElementById('results-table');
    // Get votes from localStorage
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    let html = '';
    if (votes.length === 0) {
        html = '<div style="color:#ccc;padding:18px;">No votes yet.</div>';
    } else {
        html = '<table><thead><tr><th>Teacher</th><th>Profile</th><th>Group</th></tr></thead><tbody>';
        votes.forEach(vote => {
            let profileDisplay = vote.profile === 'captain' ? 'School Captain' : (vote.profile === 'vice' ? 'Vice Captain' : vote.profile);
            html += `<tr><td>${vote.teacherTitle} ${vote.teacherName}</td><td>${profileDisplay}</td><td>Group ${vote.group}</td></tr>`;
        });
        html += '</tbody></table>';
    }
    tableDiv.innerHTML = html;
    modal.classList.remove('hidden-section');
}

function closeResultsModal() {
    document.getElementById('results-modal').classList.add('hidden-section');
}

function showFinalResultsModal() {
    const modal = document.getElementById('final-results-modal');
    const tableDiv = document.getElementById('final-results-table');
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    // Count votes for each group in each profile
    const groupVotes = {
        captain: { A: 0, B: 0 },
        vice: { A: 0, B: 0 }
    };
    votes.forEach(vote => {
        if (groupVotes[vote.profile] && groupVotes[vote.profile][vote.group] !== undefined) {
            groupVotes[vote.profile][vote.group]++;
        }
    });
    // Determine winners
    const winners = {
        captain: groupVotes.captain.A > groupVotes.captain.B ? 'A' : (groupVotes.captain.B > groupVotes.captain.A ? 'B' : 'Tie'),
        vice: groupVotes.vice.A > groupVotes.vice.B ? 'A' : (groupVotes.vice.B > groupVotes.vice.A ? 'B' : 'Tie')
    };
    // Build results HTML
    let html = '<table><thead><tr><th>Profile</th><th>Group A</th><th>Group B</th><th>Winner</th></tr></thead><tbody>';
    ['captain', 'vice'].forEach(profileKey => {
        const profile = profiles[profileKey];
        const groupA = profile.groups.A.map(c => c.name).join(', ');
        const groupB = profile.groups.B.map(c => c.name).join(', ');
        let winnerText = '';
        if (winners[profileKey] === 'Tie') {
            winnerText = '<span style="color:#fc5c7d;font-weight:700;">Tie</span>';
        } else {
            const winnerNames = profile.groups[winners[profileKey]].map(c => c.name).join(', ');
            winnerText = `<span style="color:#4BB543;font-weight:700;">Group ${winners[profileKey]}<br>(${winnerNames})</span>`;
        }
        html += `<tr><td>${profile.name}</td><td>${groupA}<br><span style='color:#6a82fb;'>Votes: ${groupVotes[profileKey].A}</span></td><td>${groupB}<br><span style='color:#6a82fb;'>Votes: ${groupVotes[profileKey].B}</span></td><td>${winnerText}</td></tr>`;
    });
    html += '</tbody></table>';
    tableDiv.innerHTML = html;
    modal.classList.remove('hidden-section');
}

function closeFinalResultsModal() {
    document.getElementById('final-results-modal').classList.add('hidden-section');
}

// Start at teacher landing
showSection('teacher-landing'); 