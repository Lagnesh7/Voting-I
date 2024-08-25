// Function to update the vote count display
function updateVoteCount(candidate, count) {
    const voteCountElement = document.getElementById(`votes-${candidate}`);
    voteCountElement.textContent = count;
}

// Function to handle the API call for voting
async function voteForCandidate(candidate) {
    try {
        const response = await fetch('https://challenges-yvxh.onrender.com/api/create-vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: candidate }) // Send the candidate ID as `id`
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update vote count with the response from the server
            updateVoteCount(candidate, data.votes);
            alert(`You voted for ${data.message}`);
            
            // Check if Candidate 3 won after voting
            if (candidate === '3' && data.votes >= 125) {
                alert('Candidate 3 wins!');
            }
        } else {
            alert('There was an issue with your vote. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting your vote. Please try again later.');
    }
}

// Add event listeners to vote buttons
document.querySelectorAll('.vote-button').forEach(button => {
    button.addEventListener('click', function() {
        const candidate = this.getAttribute('data-candidate');
        voteForCandidate(candidate);
    });
});

// Function to load initial vote counts from the server
async function loadInitialVotes() {
    try {
        const response = await fetch('https://cracking-vote-system-i.onrender.com/get-vote', {
            cache: 'no-cache' // Prevent caching of the GET request
        });
        const data = await response.json();
        
        if (data.success) {
            // Update vote counts for all candidates
            let candidate3Votes = 0; // Track votes for Candidate 3

            Object.keys(data.candidates).forEach(candidateId => {
                const candidate = data.candidates[candidateId];
                updateVoteCount(candidateId, candidate.votes);

                // Track votes for Candidate 3
                if (candidateId === '3') {
                    candidate3Votes = candidate.votes;
                }
            });

            // Check if Candidate 3 won
            if (candidate3Votes >= 50) {
                alert('Candidate 3 wins! Here is flag - {flag_VoteI_7ThCo9}');
            }
        } else {
            console.error('Failed to load initial votes:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        // alert('An error occurred while loading initial votes. Please try again later.');
    }
}

// Load initial votes when the page loads
window.onload = loadInitialVotes;
