import React, { Component } from "react";
import AuctionsContract from "./contracts/Auctions.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {highestBidder:0, highestBid: 0, web3: null, accounts: null, contract: null,input: "" };

  componentDidMount = async() => { 
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
	const response = await instance.methods.highestBid().call();
	const response2 = await instance.methods.highestBidder().call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance,highestBid: response,highestBidder: response2 });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;
   await contract.methods.bid().send({from:accounts[0], value: this.state.input});
   
  };
  withdraw = async () => {
      const { accounts, contract } = this.state;
     await contract.methods.withdraw().send({from:accounts[0]});
     
    };

   myChangeHandler = (event) => {
    this.setState({input: event.target.value}, () => {console.log(this.state.input)});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Hello Bidder!</h1>
        <p>Welcome to the Auction.</p>
        <h2>Please place your bid!</h2>
        <div>The highest bid is: {this.state.highestBid}</div>
        <div>The highest bidder is: {this.state.highestBidder}</div>
	<input type="text" onChange={this.myChangeHandler} />
	<button onClick={this.bid}>Bid</button>
	<h1>Withdraw</h1>
	<button onClick={this.withdraw}>Withdraw</button>
     </div>
    );
  }
}

export default App;
