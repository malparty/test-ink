import React, { FC, useEffect, useState } from "react";

import { spawn } from "child_process";
import Name from "./components/Name";
import { Box, Text, useApp } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";

const App: FC<{ name?: string }> = ({ name = "Stranger" }) => {
	const [query, setQuery] = useState("");
	const [appName, setAppName] = useState(name);
	const [status, setStatus] = useState("init");
	const [logs, setLogs] = useState("");

	const {exit} = useApp()

	useEffect(() => {
		setAppName(query);
		if (query.length > 5) {
			setStatus("ready");
		}
	}, [query, setAppName]);

	useEffect(() => {
		if (status !== "ready") {
			return;
		}
		// Deploy the template
		// ...
		const ls = spawn(`npx`, [`create-react-app`, appName, `--template @nimblehq`]);

		ls.stdout.on("data", (data) => {
			console.log(`stdout: ${data}`);
		});

		ls.stderr.on("data", (data) => {
			setLogs(`${logs}\n${data}`);
		});

		ls.on("error", (error) => {
			setLogs(`${logs}\nerror: ${error.message}`);
		});

		ls.on("close", (code) => {
			setLogs(`${logs}\n\nOK with code: ${code}`);
			exit();
		});
		setStatus("done");
	}, [status, setStatus]);

	return status === "init" ? (
		<>
			<Name name={appName} />
			<Box marginRight={1}>
				<Text>Enter a name for your application:</Text>
			</Box>
			<TextInput value={query} onChange={setQuery} />
		</>
	) : (
		<Box>
			<Text color="green">
				<Spinner type="bounce" />
			</Text>
			<Text color={"red"}>
				We are deploying your application <Text color={"cyan"}>{appName}</Text>{" "}
				at the moment
			</Text>
			<Text>${logs}</Text>
		</Box>
	);
};

module.exports = App;
export default App;
