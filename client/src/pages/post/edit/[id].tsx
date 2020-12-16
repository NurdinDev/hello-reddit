import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

interface EditPostProps {
}

const EditPost: React.FC<EditPostProps> = ({}) => {
    return ();
};


export default withUrqlClient(createUrqlClient)(EditPost);
