import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import propTypes from "prop-types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dropdown({ optionsName, options }) {
  //optionsName is the name of the dropdown
  //options is an array of objects
  const [clicked, setClicked] = useState(options[0]); //default value is the first element in the array

  const handleClicked = (option) => {
    setClicked(option);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-transparent hover:bg-background">
          {/*this is the name of the dropdown*/}
          {clicked}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
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
                          ? "bg-blue-100 text-gray-900"
                          : "text-gray-700", // 선택된 아이템에 대한 스타일
                        active ? "bg-gray-100" : "", // 마우스 오버 시 스타일
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={() => handleClicked(option)}
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
  optionsName: propTypes.string,
  options: propTypes.array.isRequired,
};

export default Dropdown;
