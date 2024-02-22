import React, { Component } from 'react';
import './index.css'

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackingNumber: '',
      trackingInfo: null,
      errormsg:null,
      show:false
    };
  }
 componentDidMount=()=>{
    
 }
  trackPackage = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }; 
      const response = await fetch(`http://localhost:7000/api/tracking/${this.state.trackingNumber}`,options);
      const data = await response.json();
      if(response.ok===true){
        this.setState({ trackingInfo: data });

      }
      else{
        this.setState({ show: true,errormsg:data.error });
      }
      
    } catch (error) {
      console.error('Error fetching tracking information:', error);
    }
  };

  render() {
    return (
      <div className="TrackingComponent">
        <div className='cc'>
        <h1 className='h'>Courier Tracking System</h1>
        <div className='trackingCont'>
          <label>Enter Tracking Number:</label>
          <input
            type="text"
            value={this.state.trackingNumber}
            onChange={(e) => this.setState({ trackingNumber: e.target.value })}
          />
          <button onClick={this.trackPackage}>Track Package</button>
          </div>  
        {this.state.show?<p>{this.state.errormsg}</p>:
        (this.state.trackingInfo && (
          <>
          <h2>Tracking Information</h2>
          <div className='component'>
            <p className='tn p'>Tracking Number: {this.state.trackingInfo.trackingNumber}</p>
            <p className='stat p'>Status: {this.state.trackingInfo.status}</p>
            <p className='loc p'>Location: {this.state.trackingInfo.location}</p>
          </div>
          </>
        ))}
        </div>
      </div>
    );
  }
}

export default UserHome;
