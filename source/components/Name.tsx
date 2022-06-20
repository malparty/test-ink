import React, { FC } from "react";
import { Text } from "ink";

const Name: FC<{ name?: string }> = ({ name = "Stranger" }) => (
	<Text>
		Hello,{" "}
		<Text inverse color="green">
			{name}
		</Text>
	</Text>
);

module.exports = Name;
export default Name;
