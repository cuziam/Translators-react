//redux
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

//user-defined components
import TranslateResult from "./TranslateResult";

export function TranslateResults() {
  const resultsConfig = useSelector(
    (state: RootState) => state.translate.resultsConfig
  );
  return (
    <div className="Translateresults w-80 flex-col justify-center items-center gap-2 inline-flex">
      {resultsConfig.map((_, index: number) => (
        <TranslateResult key={index} index={index} />
      ))}
    </div>
  );
}

export default TranslateResults;
