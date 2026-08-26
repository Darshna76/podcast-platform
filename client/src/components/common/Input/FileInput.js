import React, { useState } from "react";
import "./styles.css";

function FileInput({ accept, id, fileHandleFnc, text }) {
  const [fileSelected, setFileSelected] = useState("");

  const onChange = (e) => {
    console.log(e.target.files);
    setFileSelected(e.target.files[0].name);
    fileHandleFnc(e.target.files[0]);
  };

  return (
    <>
      <label
  htmlFor={id}
  className={`custom-input ${!fileSelected ? "label-input" : "active"}`}
>
  {!fileSelected ? (
    text
  ) : (
    <>
      <strong>Selected File:</strong>
      <br />
      <span className="selected-file-name">{fileSelected}</span>
    </>
  )}
</label>
      <input
        type="file"
        accept={accept}
        id={id}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
}

export default FileInput;
