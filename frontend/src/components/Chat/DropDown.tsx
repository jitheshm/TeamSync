import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { useState } from 'react'

export default function DropDown({ msgId, handleMessageDelete }: { msgId: string, handleMessageDelete: (msgId: string) => void }) {
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom-end', // adjust as necessary
        modifiers: [
            {
                name: 'preventOverflow',
                // options: {
                //     boundary: 'viewport',
                // },
            },
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['bottom-start', 'top-end', 'top-start'],
                },
            },
        ],
    })

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton ref={setReferenceElement}>
                    <i id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="fa-solid fa-caret-down absolute top-2 right-3" style={{ color: '#b0b0b0' }} />
                </MenuButton>
            </div>

            <MenuItems
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1 ">
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={() => handleMessageDelete(msgId)}
                                className={`block px-2 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                                Delete
                            </button>
                        )}
                    </MenuItem>



                </div>
            </MenuItems>
        </Menu>
    )
}
