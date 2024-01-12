import React, { useState, useRef } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

import propTypes from "prop-types";

function TranslateSource({ initialSourceConfig }) {
  //define state for TranslateSource
  const { updateSourceConfig: updateOriginSourceConfig } =
    useContext(TranslateContext);
  const [sourceConfig, setSourceConfig] = useState(initialSourceConfig);

  //define functions for TranslateSource
  //update sourceConfig
  const updateSourceConfig = (key, value) => {
    console.log("update source config...");
    setSourceConfig({ ...sourceConfig, [key]: value });
  };

  //update sourceConfig(side effect)
  useEffect(() => {
    updateOriginSourceConfig(sourceConfig);
  }, [sourceConfig, updateOriginSourceConfig]);

  //util functions
  const copyRef = useRef(null);
  const copyText = () => {
    console.log(copyRef.current);
    const text = copyRef.current.value;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  //render
  return (
    <div className="Translatesource w-80 flex-col justify-center items-start flex relative">
      <SourceContext.Provider
        value={{ sourceConfig, updateSourceConfig, copyText }}
      >
        <SourceBar />
        <SourceEditarea ref={copyRef} />
        <SourceToolbar />
      </SourceContext.Provider>
    </div>
  );
}

TranslateSource.propTypes = {
  initialSourceConfig: propTypes.object,
};

export default TranslateSource;
