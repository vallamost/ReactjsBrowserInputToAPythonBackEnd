import React from "react";
import "./App.css";
import { default as UUID } from "uuid";
import JSONPretty from "react-json-pretty";

//Provide the web front end logic.

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.myuuid = UUID.v4();
    this.state = {
      //myuuid: this.myuuid,
      data_to_submit: "Boop",
      formSubmissionResult: "Ready to submit",
      submissionHistoryArray: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.baseState = this.state;
  }

  postServerData = event => {
    const url_to_submit_data_to = "http://127.0.0.1:5000/receiveData";
    const data = {
      id: this.myuuid,
      data_to_submit: event.target.data_to_submit.value
    };

    // open a new HTTP request
    var request = new XMLHttpRequest();
    try {
      request.open("POST", url_to_submit_data_to, true);
      request.setRequestHeader(
        "Content-Type",
        "application/json; charset=UTF-8"
      );
      request.send(JSON.stringify(data));
      console.log("Data submitted to server: ", data);
      this.resetForm();
    } catch {
      console.log("Something went wrong trying to send to the server, try again later.");
    }
  };

  //reset the form after submitting
  resetForm = () => {
    setTimeout(() => {
      this.setState({ formSubmissionResult: "Ready to submit again." });
    }, 2900);

    //reset the UUID after a submission
    this.myuuid = UUID.v4();

    //reset the data_to_submit after submission
    this.setState({ data_to_submit: "", requestid: "" });

  };

  //TO DO: Break this out into separate functions..
  handleSubmit(event) {
    event.preventDefault(); //don't reload the page upon submit.

    console.log("Submitting UUID: ", this.myuuid);
    console.log(
      "Submitting data_to_submit: ",
      event.target.data_to_submit.value
    );
    const data = {
      id: this.myuuid,
      data_to_submit: event.target.data_to_submit.value
    };

    //Add entries to the submission array for local history
    this.state.submissionHistoryArray.push(data);

    //update the status text upon a submission.
    this.setState({ formSubmissionResult: "Form submitted!..." });

    //start sending data to the server using this function.
    this.postServerData(event);
  }

  //Assign the input to the targets as its entered into the object state.
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
      //date: date.target.value,
    });
    //console.log(event.target.value)
  };

  render() {
    return (
      <div className="App">
      <form onSubmit={this.handleSubmit}>
        <label>
          Unique ID for this visit: <span>{this.myuuid}</span>
        </label>
        <br />
        <br />
        <label>
          Data you want to submit to the Python Server: &nbsp; <br />
          <input
            className="hostInput"
            type="text"
            name="data_to_submit"
            placeholder="Enter something here."
            onChange={this.handleChange}
            value={this.state.data_to_submit}
          />
        </label>
        <br />
        <input className="submitButton" type="submit" value="Submit" />
        <div className="outputresult">
          <h3>{this.state.formSubmissionResult}</h3>
        </div>
        <div className="submissionHistory_class">
          JSON submission history:
          <JSONPretty
            id="json-pretty"
            data={this.state.submissionHistoryArray}
          ></JSONPretty>
        </div>
      </form>
      </div>
    );
  }
}

export default MyForm;
