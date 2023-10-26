import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import VotingContract from './contract/Voting.json';


function App() {

  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const init = async () => {
      //Connect to MetaMask or another web3 provider
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request access to user's accounts
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          const contractAddress = "0xc62c83D2e8EDB96C398FF4F9Df9d03Cd60BC2103";
          const contractABI = VotingContract.abi;
          const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
          const myContract = new web3.eth.Contract(contractABI, contractAddress);
          setContract(myContract);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected.');
      }
    };

    init();
  }, []);

  const vote = async () => {
    if (contract) {
      try{
        console.log(window.ethereum.selectedAddress,'address')
      
      await contract.methods.vote(1).send({
        from: window.ethereum.selectedAddress,
        gas: 4712388,
        gasPrice: 100000000000
       })
      .then((res ) => {
        console.log("res", res.transactionHash)
      })
    }
  
  catch(error){
    console.error('Error voting: ', error);
  }
}
  }

  const getCandidatesData = async () => {
    try{
      const condidateData = await contract.methods.getAllVotesOfCandidates().call();
      if(condidateData){
        setCandidates(condidateData)
      }
    }
    catch(error){
      console.error('Error getting candidate data: ', error);
    }
  }

  if(candidates.length!=0){
  console.log( Object.values( candidates[2])[3],'candidates');

  }
  // console.log( candidates,'condidate'  )



  return (
    <div>
      <h1>Voting App</h1>

      {
        candidates.length!=0? <select onChange={(e) => setSelectedCandidate(e.target.value)}>
        {candidates.map((candidate, index) => (
          <option key={index} >{Object.values(candidate)[3] }</option>
        ))}
      </select>:''
      }
     
      <button onClick={()=>vote()}>Vote</button>
          
      <button onClick={()=>getCandidatesData()}>GetCondidates</button>
    </div>
  );
}

export default App;
