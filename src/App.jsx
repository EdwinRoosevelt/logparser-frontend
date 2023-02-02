import { useState } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
	const [parseStatus, setParseStatus] = useState("READY");
	const [errMessage, setErrMessage] = useState("");

	const downloadFile = (filename, data) => {
		var element = document.createElement("a");

		element.setAttribute(
			"href",
			"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
		);
		element.setAttribute("download", filename);

		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleImport = async (evt) => {
		let logFile = evt.target.files[0];
		if (!logFile) return;
		console.log(logFile);

		const logFormData = new FormData();
		logFormData.append("file", logFile);

		setParseStatus("PARSING");

		try {
			// giving some time to see the loading animation
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const response = await axios({
				method: "post",
				url: "http://localhost:3030/api/v1/logparser/parse/upload",
				data: logFormData,
				headers: { "Content-Type": "multipart/form-data" },
			});

			console.log(response);
			downloadFile("transaction.json", response.data);
			setParseStatus("SUCCESS");
		} catch (err) {
			setParseStatus("FAILURE");
			console.log(err);
			setErrMessage(err.response.data.message);
			// setErrMessage("Something went wrong 😔");
		}

		setTimeout(() => {
			setParseStatus("READY");
		}, 3000);
	};

	return (
		<div className="App">
			<div>
				<a href="https://nestjs.com" target="_blank">
					<img src="/nestjs.svg" className="logo nest" alt="Nestjs logo" />
				</a>

				<a href="https://reactjs.org" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
				<a href="https://vitejs.dev" target="_blank">
					<img src="/vite.svg" className="logo vite" alt="Nestjs logo" />
				</a>
			</div>
			<h1>Log Parser</h1>
			<p>Segregates Log with level Error and Warn</p>
			<div className="card">
				{/* <button>Upload</button> */}
				{parseStatus === "PARSING" && (
					<div className="lds-spinner">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				)}

				{parseStatus === "READY" && (
					<>
						<label className="importbtn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								className="bi bi-upload"
								viewBox="0 0 16 16"
							>
								<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
								<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
							</svg>
							Upload
							<input
								type="file"
								style={{ display: "none" }}
								accept=".log"
								onChange={(evt) => {
									handleImport(evt);
								}}
							></input>
						</label>
						<p>
							*Accepts only .log files |{" "}
							<a href="./transaction.log" download>
								sample file
							</a>
						</p>
					</>
				)}

				{parseStatus === "SUCCESS" && (
					<div className="success-text">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-check2-circle"
							viewBox="0 0 16 16"
						>
							<path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<p>Log parsed successfully!</p>
					</div>
				)}

				{parseStatus === "FAILURE" && (
					<div className="failure-text">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-x-circle"
							viewBox="0 0 16 16"
						>
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
							<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
						</svg>
						<p>{errMessage || "Something went wrong 😔"}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
