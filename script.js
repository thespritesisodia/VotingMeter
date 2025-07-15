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
            <img src="https://via.placeholder.com/56x56.png?text=Photo" alt="${candidate.name}" class="candidate-photo" />
            <span class="candidate-name">${candidate.name}</span>
            <button class="vote-btn" onclick="voteCandidate('${candidate.id}')">Vote</button>
        `;
        candidatesList.appendChild(card);
    });
}

function voteCandidate(candidateId) {
    const title = localStorage.getItem('teacherTitle') || '';
    const name = localStorage.getItem('teacherName') || '';
    const profile = selectedProfile;
    const group = selectedGroup;
    // Prevent double voting for the same profile
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    const alreadyVoted = votes.some(v => v.teacherTitle === title && v.teacherName === name && v.profile === profile);
    if (alreadyVoted) {
        alert('You have already voted for this profile!');
        return;
    }
    // Store the vote
    votes.push({
        teacherTitle: title,
        teacherName: name,
        profile: profile,
        group: group,
        candidateId: candidateId
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
    showSection('teacher-landing');
}

function showResults() {
    const password = prompt('Enter results password:');
    if (password !== 'Sprite@12345') {
        alert('Incorrect password!');
        return;
    }
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
                <td style='padding:10px 8px;'>${candidateName}</td>
            </tr>`;
        });
    }
    tableHtml += `</tbody></table></div>`;

    // Only show the table in the results-flex-container
    resultsList.innerHTML = `
        <div class="results-flex-container">
            <div class="results-table-box">${tableHtml}</div>
        </div>
        <div style="text-align:center;margin-top:2em;">
            <button class="vote-btn" style="font-size:1.1em;padding:12px 28px;" onclick="showFinalResults()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:8px;"><path d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2M21 5a3 3 0 0 1-3 3c-1.5 0-3-1.5-3-3M3 5a3 3 0 0 0 3 3c1.5 0 3-1.5 3-3"/><path d="M17 5a5 5 0 0 1-10 0"/></svg>
                Final Results
            </button>
        </div>
    `;
    showSection('results-page');
}

function showFinalResults() {
    // Gather votes
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    // Prepare winners object
    const winners = {
        captain: { A: null, B: null },
        vice: { A: null, B: null }
    };
    // Count votes per candidate per group
    const voteCounts = {
        captain: { A: {}, B: {} },
        vice: { A: {}, B: {} }
    };
    // Initialize counts
    Object.keys(profiles).forEach(profileKey => {
        Object.keys(profiles[profileKey].groups).forEach(groupKey => {
            profiles[profileKey].groups[groupKey].forEach(candidate => {
                voteCounts[profileKey][groupKey][candidate.id] = 0;
            });
        });
    });
    // Tally votes
    votes.forEach(vote => {
        if (voteCounts[vote.profile] && voteCounts[vote.profile][vote.group] && voteCounts[vote.profile][vote.group][vote.candidateId] !== undefined) {
            voteCounts[vote.profile][vote.group][vote.candidateId]++;
        }
    });
    // Find winners
    Object.keys(voteCounts).forEach(profileKey => {
        Object.keys(voteCounts[profileKey]).forEach(groupKey => {
            let maxVotes = -1;
            let winnerId = null;
            Object.entries(voteCounts[profileKey][groupKey]).forEach(([cid, count]) => {
                if (count > maxVotes) {
                    maxVotes = count;
                    winnerId = cid;
                }
            });
            winners[profileKey][groupKey] = winnerId;
        });
    });
    // Build winners HTML with photo and congratulations
    let html = '<div class="final-winners-flex">';
    Object.keys(winners).forEach(profileKey => {
        const profile = profiles[profileKey];
        Object.keys(winners[profileKey]).forEach(groupKey => {
            const winnerId = winners[profileKey][groupKey];
            let winnerName = 'No votes';
            let photoUrl = 'https://via.placeholder.com/90x90.png?text=Photo';
            if (winnerId) {
                const candidate = profile.groups[groupKey].find(c => c.id === winnerId);
                if (candidate) {
                    winnerName = candidate.name;
                    // If you have real photos, use candidate.photo or similar here
                }
            }
            html += `
                <div class='final-winner-card'>
                    <img src="${photoUrl}" alt="${winnerName}" class="final-winner-photo" />
                    <div class="final-winner-congrats">🎉 Congratulations!</div>
                    <div class="final-winner-profile">${profile.name} - Group ${groupKey}</div>
                    <div class="final-winner-name">${winnerName}</div>
                </div>
            `;
        });
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