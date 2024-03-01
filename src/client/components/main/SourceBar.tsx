import React from "react";
//user-defined components
import Dropdown from "./Dropdown";
import ServerStatus from "./ServerStatus";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { translateSliceActions } from "../../store/translate-slice";

export default function SourceBar() {
  //redux
  const dispatch = useDispatch();
  const { sourceLang, supportedLangs } = useSelector(
    (state: RootState) => state.translate.sourceConfig
  );

  return (
    <div className="SourceBar w-80 h-9 px-2 bg-background rounded-tl-md rounded-tr-md border-2 border-black border-opacity-5 justify-between items-center inline-flex">
      <Dropdown
        optionsName="sourceLang"
        options={supportedLangs}
        initialOption={sourceLang}
        updateConfig={(value: string) =>
          dispatch(
            translateSliceActions.updateSourceConfig({
              sourceLang: value,
            })
          )
        }
      />
      <ServerStatus />
    </div>
  );
}
