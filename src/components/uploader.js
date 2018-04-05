import React, { Component } from "react";
import "./uploader.css";
import { post, get } from "axios";
import download from "js-file-download";
import { Animated } from "react-animated-css";

class Uploader extends Component {
  state = {
    file: null,
    fileUploaded: false,
    response: "",
    uploadedFiles: []
  };

  componentWillMount() {
    this.hadleDelay();
  }

  hadleDelay() {
    get("/getFiles").then(res => {
      this.setState({
        fileUploaded: false,
        response: "",
        uploadedFiles: res.data.uploadedFiles,
        fileCount: res.data.uploadedFiles.length
      });
      this.props.fileCount(this);
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.file !== null) {
      //check if there is input file given then make a POST request
      this.fileUpload(this.state.file).then(res => {
        this.setState({
          fileUploaded: true,
          response: res.data.message,
          file: null
        });
      });
      this.timer = setTimeout(this.hadleDelay.bind(this), 2000);
    } else {
      this.setState({
        fileUploaded: true,
        response: "No files chosen"
      });
      this.timer = setTimeout(this.hadleDelay.bind(this), 1000);
    }

    this.refs.inputfile.value = ""; // reset form input after submition
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }
  fileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    return post("/", formData);
  }
  fileDownload(index, filename, evnt) {
    if (evnt.target.className === "download-btn") {
      get("/download", { params: { filename: filename, index: index } }).then(
        res => {
          console.log(res);
          download(res.data, filename);
        }
      );
    }
  }
  render() {
    return (
      <section className="main-section">
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <section className="title">
            <h1 className="main-title">
              {this.state.fileUploaded
                ? this.state.response
                : "Content uploader"}
            </h1>

            <p className="sub-title"> Simple content uploader</p>
          </section>
          <section className="btns">
            <input
              type="file"
              name="file"
              ref="inputfile"
              id="file"
              className="inputfile"
              onChange={this.onChange.bind(this)}
            />

            <button type="submit" className="btn-left">
              Upload
            </button>
          </section>
        </form>

        <div className="uploadContainer">
          {this.props.startFetch ? (
            <ul>
              <Animated
                animationIn="jello"
                animationOut="wobble"
                isVisible={true}
              >
                {this.state.uploadedFiles.map((filename, index) => (
                  <li
                    key={filename}
                    className="file-name"
                    onClick={this.fileDownload.bind(this, index, filename)}
                  >
                    <p>{filename}</p>
                    <button className="download-btn">DOWNLOAD</button>
                  </li>
                ))}{" "}
              </Animated>
            </ul>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}

export default Uploader;
