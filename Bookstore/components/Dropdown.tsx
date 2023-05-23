import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";

interface RadixMenuItem {
  label: string;
}

const generalMenuItems: RadixMenuItem[] = [
  {
    label: "Just In",
  },
  {
    label: "Price Low to High",
  },
  {
    label: "Price High to Low",
  },
];

const DropdownMenuDemo = ({ sortMethod, setSortMethod }) => {
  // console.log("sortMethod: ", sortMethod);

  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  function handleSortMethod(label) {
    setSortMethod(label);
  }

  return (
    <div className="relative items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="px-2 text-[13px] whitespace-nowrap float-right bg-white  outline-none hover:bg-[#f6f2f2]  rounded-md"
            aria-label="Customise options"
          >
            <div className="flex ">
              <p>{sortMethod} </p>
              <CaretDownIcon
                className="text-violet10 relative top-[1px] transition-transform duration-[250] ease-in "
                aria-hidden
              />
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className=" dark:bg-gray-800 bg-white   rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            sideOffset={5}
          >
            {generalMenuItems.map(({ label }, i) => (
              <DropdownMenu.Item
                key={`${label}-${i}`}
                className="group text-[13px] leading-nonerounded-[3px] flex items-center h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-customGreyColor data-[highlighted]:text-black"
                onClick={() => handleSortMethod(label)}
              >
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default DropdownMenuDemo;
