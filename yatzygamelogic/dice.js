class Dice {
    constructor() {
      this.diceValues = [0, 0, 0, 0, 0];
      this.heldDice = [false, false, false, false, false];
      this.rollsLeft = 3;
    }
  
    roll() {
      if (this.rollsLeft > 0) {
        for (let i = 0; i < 5; i++) {
          if (!this.heldDice[i]) {
            this.diceValues[i] = Math.floor(Math.random() * 6) + 1;
          }
        }
        this.rollsLeft--;
      }
      return this.diceValues;
    }
  
    toggleHold(index) {
      this.heldDice[index] = !this.heldDice[index];
    }
  
    resetRolls() {
      this.rollsLeft = 3;
      this.heldDice = [false, false, false, false, false];
    }
  
    getDiceValues() {
      return this.diceValues;
    }
  
    getRollsLeft() {
      return this.rollsLeft;
    }
  }
  
  module.exports = Dice;
  