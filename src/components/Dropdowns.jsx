import react from "React";

function Dropdowns() {
  const toolList = [];
  const languageList = [];
  return (
    <>
      <Dropdown optionsName="Tools" options={toolList} />
      <Dropdown optionsName="Languages" options={languageList} />
    </>
  );
}
