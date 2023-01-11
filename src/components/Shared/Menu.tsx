import { Menu, Transition } from "@headlessui/react"
import React, { Fragment } from "react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"

interface IMenuDropdown {
  title: string
  options: string[]
}
const MenuDropdown: React.FC<IMenuDropdown> = ({ title, options }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="cursor-pointer  inline-flex w-full justify-center items-center rounded-md bg-transparent bg-opacity-20 px-4 py-2 text-md font-medium text-primary hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {title}
          <ChevronDownIcon
            className="ml-2 -mr-1 w-8 h-8 text-primary-light hover:opacity-50"
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
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-lighter rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {options.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-dark"
                    } group flex w-full items-center rounded px-2 py-2 text-sm`}
                  >
                    {option}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default MenuDropdown
