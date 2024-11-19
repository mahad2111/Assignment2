let diceValues = [0, 0, 0, 0, 0];
let heldDice = [false, false, false, false, false];
let rollsLeft = 3;
let totalScore = 0;
let possibleScores = {};

const rollButton = $('#rollButton');

// initialize game state from the server
getGameState();

// event listeners for dice (hold/unhold)
$('.dice').each(function(index) {
  $(this).on('click', function() {
    toggleHold(index);
  });
});

// roll dice event listener
rollButton.on('click', rollDice);

// function to roll dice (server call and animation)
function rollDice() {
  // start the rolling animation
  $('.dice').each(function() {
    const diceElement = $(this);
    diceElement.addClass('rolling');

    // display random Unicode dice during animation
    const rollingInterval = setInterval(() => {
      const unicodeDice = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];
      const randomIndex = Math.floor(Math.random() * 6);
      diceElement.text(unicodeDice[randomIndex]);
    }, 100);

    // store interval ID in the element's data to clear later
    diceElement.data('rollingInterval', rollingInterval);
  });

  // fetch the actual dice values from the server
  fetch('/roll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message);
        });
      }
      return response.json();
    })
    .then(data => {
      diceValues = data.diceValues;
      rollsLeft = data.rollsLeft;
      possibleScores = data.possibleScores;

      // stop the rolling animation and update the display
      stopRollingAnimation();

      // update the dice display with the actual values
      $('.dice').each(function(index) {
        const diceElement = $(this);
        const unicodeDice = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];
        diceElement.text(unicodeDice[diceValues[index] - 1]);
      });

      updateRollsLeftDisplay();
      updatePossibleScoresDisplay();
      updateDiceHoldStatus();
    })
    .catch(error => {
      alert(error.message);
      // stop the rolling animation even on error
      stopRollingAnimation();
    });
}

// function to stop the rolling animation
function stopRollingAnimation() {
  $('.dice').each(function() {
    const diceElement = $(this);
    diceElement.removeClass('rolling');

    // clear the rolling interval
    clearInterval(diceElement.data('rollingInterval'));
  });
}

// function to hold or release a die
function toggleHold(index) {
  fetch(`/hold/${index}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message);
        });
      }
      return response.json();
    })
    .then(data => {
      heldDice = data.heldDice;
      updateDiceHoldStatus();
    })
    .catch(error => alert(error.message));
}

// function to score a category
function scoreCategory(category) {
  fetch(`/score/${category}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message);
        });
      }
      return response.json();
    })
    .then(data => {
      updateScoresDisplay(data.scores);
      totalScore = data.totalScore;
      updateTotalScoreDisplay();
      resetDiceDisplay();
      possibleScores = {};
      updatePossibleScoresDisplay();
    })
    .catch(error => alert(error.message));
}

// function to get the current game state from the server
function getGameState() {
  fetch('/state')
    .then(response => response.json())
    .then(data => {
      diceValues = data.diceValues;
      heldDice = data.heldDice;
      rollsLeft = data.rollsLeft;
      totalScore = data.totalScore;
      possibleScores = data.possibleScores || {};
      updateDiceDisplay();
      updateDiceHoldStatus();
      updateScoresDisplay(data.scores);
      updateTotalScoreDisplay();
      updateRollsLeftDisplay();
      updatePossibleScoresDisplay();
    })
    .catch(error => console.error('Error:', error));
}

// function to update the dice display
function updateDiceDisplay() {
  const unicodeDice = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];
  $('.dice').each(function(index) {
    const diceElement = $(this);
    const value = diceValues[index];
    diceElement.text(value > 0 ? unicodeDice[value - 1] : '');
  });
}

// function to update the held status of dice
function updateDiceHoldStatus() {
  heldDice.forEach((held, index) => {
    const diceElement = $(`.dice:eq(${index})`);
    if (held) {
      diceElement.addClass('held');
    } else {
      diceElement.removeClass('held');
    }
  });
}

// function to update the scores display
function updateScoresDisplay(scores) {
  for (const [category, score] of Object.entries(scores)) {
    const scoreElement = $(`#${category}Score`);
    if (scoreElement.length && score !== null) {
      scoreElement.text(score);
      scoreElement.addClass('final-score');
      const labelElement = $(`label[data-category="${category}"]`);
      labelElement.addClass('disabled');

      // Remove existing event listener by cloning the node
      const newLabelElement = labelElement.clone();
      labelElement.replaceWith(newLabelElement);
    }
  }
}

// function to update the total score display
function updateTotalScoreDisplay() {
  $('#totalScore').text(`Total: ${totalScore}`);
}

// function to update rolls left display
function updateRollsLeftDisplay() {
  rollButton.text(`Roll Dice (${rollsLeft} rolls left)`);
  if (rollsLeft === 0) {
    rollButton.prop('disabled', true);
  } else {
    rollButton.prop('disabled', false);
  }
}

// function to reset the dice display after scoring
function resetDiceDisplay() {
  diceValues = [0, 0, 0, 0, 0];
  heldDice = [false, false, false, false, false];
  rollsLeft = 3;
  updateDiceDisplay();
  updateDiceHoldStatus();
  updateRollsLeftDisplay();
}

// function to update the possible scores display
function updatePossibleScoresDisplay() {
  $('.possible-score').each(function() {
    const elem = $(this);
    elem.removeClass('possible-score');
    if (!elem.hasClass('final-score')) {
      elem.text('');
    }
  });

  for (const [category, score] of Object.entries(possibleScores)) {
    const scoreElement = $(`#${category}Score`);
    if (scoreElement.length && !scoreElement.hasClass('final-score')) {
      scoreElement.text(score !== null ? score : '');
      scoreElement.addClass('possible-score');
    }
  }
}

// event listeners for scoring categories
$('.score-section label').on('click', function() {
  const label = $(this);
  if (!label.hasClass('disabled')) {
    const category = label.attr('data-category');
    scoreCategory(category);
  }
});
