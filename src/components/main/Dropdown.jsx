import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import propTypes from "prop-types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//optionsName is the name of the dropdown
//options is an array of objects
function Dropdown({ optionsName, options, initialOption, updateConfig }) {
  const [clicked, setClicked] = useState(initialOption); //default value is the first element in the array

  const handleClicked = (optionsName, option) => {
    setClicked(option);
    updateConfig(optionsName, option);
  };

  return (
    <Menu as="div" className="relative inline-block text-left group">
      <div>
        <Menu.Button className="h-9 px-3 py-2 bg-white bg-opacity-5 rounded-md justify-start items-center gap-2 inline-flex hover:bg-primaryGray">
          {/*this is the name of the dropdown*/}
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="h-5 text-text text-sm font-bold font-sans whitespace-nowrap">
              {clicked}
            </div>
            <ChevronDownIcon className="h-5 w-5 text-icon" aria-hidden="true" />
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute max-h-48 overflow-auto left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => {
              return (
                <Menu.Item key={option}>
                  {({ active }) => (
                    <a
                      className={classNames(
                        option === clicked
                          ? "bg-primaryGray text-gray-900"
                          : "text-gray-700", // 선택된 아이템에 대한 스타일
                        active ? "bg-gray-100" : "", // 마우스 오버 시 스타일
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={() => handleClicked(optionsName, option)}
                    >
                      {option}
                    </a>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

Dropdown.propTypes = {
  optionsName: propTypes.string.isRequired,
  options: propTypes.array.isRequired,
  initialOption: propTypes.string.isRequired,
  updateConfig: propTypes.func.isRequired,
};

export default Dropdown;
