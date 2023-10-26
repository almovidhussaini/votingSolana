const Voting = artifacts.require("Voting");

module.exports = function (deployer){
    const candidatesNames = ["Candidate1","Candidate2","Candidate3","Candidate4","Canidate5"];

    deployer.deploy(Voting, candidatesNames);
}