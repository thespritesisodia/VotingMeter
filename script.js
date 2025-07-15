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

    // Candidate summary for each profile
    const candidateVotes = {};
    Object.keys(profiles).forEach(profileKey => {
        const profile = profiles[profileKey];
        Object.keys(profile.groups).forEach(groupKey => {
            profile.groups[groupKey].forEach(candidate => {
                candidateVotes[candidate.id] = 0;
            });
        });
    });
    votes.forEach(vote => {
        if (candidateVotes[vote.candidateId] !== undefined) {
            candidateVotes[vote.candidateId]++;
        }
    });

    // Separate summary for each profile
    let summaryHtmlCaptain = `<div class='results-summary-box'><h3 style='color:#fc5c7d;margin-top:0;'>School Captain</h3>`;
    Object.keys(profiles.captain.groups).forEach(groupKey => {
        summaryHtmlCaptain += `<h4 style='color:#6a82fb;margin-top:1em;'>Group ${groupKey}</h4><ul style='margin-bottom:1.5em;'>`;
        profiles.captain.groups[groupKey].forEach(candidate => {
            summaryHtmlCaptain += `<li style='margin-bottom:0.5em;'><b>${candidate.name}</b>: ${candidateVotes[candidate.id]} vote(s)`;
            summaryHtmlCaptain += `</li>`;
        });
        summaryHtmlCaptain += `</ul>`;
    });
    summaryHtmlCaptain += `</div>`;

    let summaryHtmlVice = `<div class='results-summary-box'><h3 style='color:#fc5c7d;margin-top:0;'>Vice Captain</h3>`;
    Object.keys(profiles.vice.groups).forEach(groupKey => {
        summaryHtmlVice += `<h4 style='color:#6a82fb;margin-top:1em;'>Group ${groupKey}</h4><ul style='margin-bottom:1.5em;'>`;
        profiles.vice.groups[groupKey].forEach(candidate => {
            summaryHtmlVice += `<li style='margin-bottom:0.5em;'><b>${candidate.name}</b>: ${candidateVotes[candidate.id]} vote(s)`;
            summaryHtmlVice += `</li>`;
        });
        summaryHtmlVice += `</ul>`;
    });
    summaryHtmlVice += `</div>`;

    // Use flex container for side-by-side layout with CSS classes
    resultsList.innerHTML = `
        <div class="results-flex-container">
            <div class="results-table-box">${tableHtml}</div>
            ${summaryHtmlCaptain}
            ${summaryHtmlVice}
        </div>
    `;
    showSection('results-page');
}

// Start at teacher landing
showSection('teacher-landing'); 