import React, { Component } from "react";
import ReactDOM from "react-dom";

// UploaderComponent is imported here
import UploaderComponent from "./components/uploader";


import "./App.css";
// <img src={logo} className="App-logo" alt="logo" />
class App extends Component {
  state = {
    fileCount: 0,
    startFetch: false
  };

  // hadles counting of uploaded files
  handleCount(e) {
    this.setState({ fileCount: e.state.uploadedFiles.length });
  }

  // starts the fetching process
  startFech() {
    this.setState({
      startFetch: true
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="info">
            <button className="fetch" onClick={this.startFech.bind(this)}>
              Fetch
            </button>

            <div className="count">
              <h1 className="num">{this.state.fileCount}</h1>
              <p className="text">File/s uploaded</p>
            </div>
          </div>
          {/* <h1 className="logo-title"> Telia</h1>*/}
        </header>

        {/* The file uploader component below is imported from /components/uploader.js */}

        <UploaderComponent
          fileCount={this.handleCount.bind(this)}
          startFetch={this.state.startFetch}
        />

        {/*You can see how it works by looking at the file itself the rest of this page is full of decoratorations*/}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
