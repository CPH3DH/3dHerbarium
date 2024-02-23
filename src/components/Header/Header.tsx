/**
 * @file /components/Header/Header.tsx
 * @fileoverview the header component used throughout the application.
 * It contains a search bar, the site logo, and links to the other pages.
 * It doubles as a drawer component to allow navigation in mobile browsers.
 */

'use client';

import Image from 'next/image'
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Input, Navbar, NavbarContent, NavbarMenuToggle, NavbarItem,
  NavbarBrand, NavbarMenu, NavbarMenuItem, Divider, Skeleton,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure
} from "@nextui-org/react";

import { autocompleteSearch } from "@/api/fetchFunctions";
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter";

import { useIsClient } from "@/utils/isClient";
import { SiteReadyModels } from "@/api/types";

import { SearchIcon } from "./SearchIcon";
import { timeout } from '@/utils/timeout';

const menuItems: string[] = [
  "Home",
  "Collections",
  "iNaturalist",
  "Plant.id",
  "Accessibility"
];

type SearchHeaderProps = {
  headerTitle: string,
  pageRoute: string;
  siteReadyModels?: SiteReadyModels[];
  searchTerm?: string;
  page?: string;
};

const Header = (props: SearchHeaderProps) => {

  const isClient: boolean = useIsClient();
  const params = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const headerTitle: string = props.headerTitle;
  const pageRoute: string = props.pageRoute;
  var searchTerm: string | undefined;
  const siteReadyModels: SiteReadyModels[] | undefined = props.siteReadyModels;

  const specimenName: string = (params['specimenName']) as string ?? headerTitle ?? '';

  if (isClient) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      document.cookie = "theme=dark";
    } else {
      document.documentElement.classList.remove('dark');
      document.cookie = "theme=light";
    }
    searchTerm = props.searchTerm || sessionStorage.getItem("searchTerm") || "sequoia sempervirens";
    if (searchTerm) { sessionStorage.setItem("searchTerm", searchTerm); }
  }

  const [inputWidth, setInputWidth] = useState<string>("15vw");
  const [query, setQuery] = useState<string>("");
  const [searchResultsLoading, setSearchResultsLoading] = useState<boolean>(false);
  const [hideResults, setHideResults] = useState<boolean>(true);
  const [autocompleteSearchResults, setAutocompleteSearchResults] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const isModel = (specimen: string): boolean => {
    if (!siteReadyModels) return false;
    for (let i = 0; i < siteReadyModels.length; i++) {
      let model = siteReadyModels[i];
      if (model.spec_name.toLowerCase().includes(specimen.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  const autocomplete = async (query: string) => {
    setSearchResultsLoading(true);
    setQuery(query);

    if (query.length === 0) {
      setAutocompleteSearchResults([]);
      setSearchResultsLoading(false);
      return;
    }

    let results: string[] = [];

    if (siteReadyModels) {
      const queryLower = query.toLowerCase();
      let tempResults = new Set<string>();

      siteReadyModels.forEach(model => {
        const nameLower = model.spec_name.toLowerCase();
        const formattedName = model.spec_name[0].toUpperCase() + model.spec_name.slice(1);
        if (nameLower.startsWith(queryLower) || nameLower.includes(queryLower)) {
          tempResults.add(formattedName);
        }
      });

      results = Array.from(tempResults).slice(0, 6);
    }

    const res: string[] = await autocompleteSearch(query);

    const combinedResults: string[] = results.concat(res);
    const uniqueResults: string[] = Array.from(new Set(combinedResults));
    setAutocompleteSearchResults(uniqueResults);

    setHideResults(false);
    setSearchResultsLoading(false);
  };

  const handleInputFocus = () => {
    setInputWidth("25vw");
    setHideResults(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    let newIndex: number;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex(prevIndex => {
        newIndex = prevIndex < autocompleteSearchResults.length - 1 ? prevIndex + 1 : prevIndex;
        setQuery(autocompleteSearchResults[newIndex]);
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(prevIndex => {
        newIndex = prevIndex > 0 ? prevIndex - 1 : 0;
        setQuery(autocompleteSearchResults[newIndex]);
        return newIndex;
      });
    } else if (event.key === "Enter" && highlightedIndex > -1) {
      event.preventDefault();
      const searchButton = document.getElementById('search-button-inat');
      if (searchButton) searchButton.click();
    } else if (event.shiftKey && event.key === "Tab") {
      event.preventDefault();
      setHighlightedIndex(prevIndex => {
        newIndex = prevIndex > 0 ? prevIndex - 1 : autocompleteSearchResults.length - 1;
        setQuery(autocompleteSearchResults[newIndex]);
        return newIndex;
      });
    } else if ((event.key === "Tab" || event.key === "ArrowDown") && highlightedIndex > -1) {
      event.preventDefault();
      setHighlightedIndex(prevIndex => {
        newIndex = prevIndex < autocompleteSearchResults.length - 1 ? prevIndex + 1 : 0;
        setQuery(autocompleteSearchResults[newIndex]);
        return newIndex;
      });
    } else if (event.key === 'Enter') {
      const searchButton = document.getElementById('search-button-inat');
      if (searchButton) searchButton.click();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setHideResults(true);
        setInputWidth("15vw");
      }
    };

    if (autocompleteSearchResults.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [autocompleteSearchResults]);

  return (
    <>
      <Navbar isBordered className="justify-between max-w-none bg-[#004C46] dark:bg-[#212121] text-white dark:text-white">
        <NavbarContent className="lg:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent as="div" className="items-center hidden lg:flex" justify="start">
          <NavbarItem>
            <div ref={searchRef}>
              <div className="flex items-center w-full">
                <Input
                  value={query}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  id="iNatSearch"
                  onChange={async (e) => await autocomplete(e.target.value)}
                  style={{ width: inputWidth, transition: "width 0.5s ease-in-out", marginRight: 0 }}
                  autoComplete="off"
                  classNames={{
                    base: `flex-grow justify-center sm:justify-start h-10 max-w-[200px] md:max-w-[275px] lg:max-w-[500px]`,
                    mainWrapper: "h-full",
                    input: "text-small border-none focus:ring-0 focus:ring-offset-0",
                    inputWrapper: "h-full font-normal text-default-500 border-1 rounded-r-none rounded-l",
                  }}
                  placeholder={"Specimen Search"}
                  size="sm"
                  startContent={<SearchIcon size={16} width="" height="" />}
                  type="search"
                />
                <a tabIndex={-1} id="search-button-inat" href={pageRoute && query ? `/${pageRoute}/${query}` : pageRoute && specimenName ? `/${pageRoute}/${specimenName}` : `/collections/${query}`}>
                  <button className="ml-0 text-white bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out h-10 px-4 rounded-l-none rounded-r">
                    <SearchIcon style={{ color: "black" }} size={22} width="" height="" />
                  </button>
                </a>
              </div>
              <>
                {searchResultsLoading ?
                  <>
                    <ul tabIndex={-1} className="absolute z-10 bg-white dark:bg-[#3d3d3d] shadow-md mt-1 max-h-60 overflow-auto rounded">
                      <li tabIndex={-1} style={{ width: `calc(${inputWidth} + 2.75rem)` }} className=" max-w-[200px] sm:max-w-[160px] md:max-w-[275px] lg:max-w-[460px] p-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer rounded-xl">
                        <Skeleton className="flex w-[100%] h-[1.3rem]" />
                      </li>
                      <li tabIndex={-1} style={{ width: `calc(${inputWidth} + 2.75rem)` }} className="max-w-[200px] sm:max-w-[160px] md:max-w-[275px] lg:max-w-[460px]  p-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer rounded-xl">
                        <Skeleton className="flex w-[100%] h-[1.3rem]" />
                      </li>
                      <li tabIndex={-1} style={{ width: `calc(${inputWidth} + 2.75rem)` }} className="max-w-[200px] sm:max-w-[160px] md:max-w-[275px] lg:max-w-[460px]  p-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer rounded-xl">
                        <Skeleton className="flex w-[100%] h-[1.3rem]" />
                      </li>
                    </ul>
                  </>
                  : autocompleteSearchResults.length > 0 && !hideResults ? (
                    <ul tabIndex={-1} className="absolute z-10 bg-white dark:bg-[#3d3d3d] shadow-md mt-1 rounded">
                      {autocompleteSearchResults.map((item: string, index: number) => (
                        <a tabIndex={0} key={item + index} onClick={() => setQuery(item)} href={`/${pageRoute}/${item}`} className='flex'>
                          <li value={item} ref={el => itemRefs.current[index] = el} tabIndex={-1} style={{ width: `calc(${inputWidth} + 2.75rem)` }} className={`max-w-[200px] hover:bg-gray-100 dark:hover:bg-gray-500 sm:max-w-[160px] md:max-w-[275px] lg:max-w-[460px] p-2 cursor-pointer rounded text-black dark:text-white ${index === highlightedIndex ? "bg-gray-100 dark:bg-gray-500" : ""}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              {item}
                              {isModel(item) && <strong className="text-[#FFC72C]">3D</strong>}
                            </div>
                          </li>
                        </a>
                      ))}
                    </ul>

                  )
                    :
                    <></>
                }
              </>
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="lg:hidden pr-3" justify="center">
          <NavbarBrand>
            <p className="font-bold text-[white]"><i>{toUpperFirstLetter(decodeURIComponent(specimenName))}</i></p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden lg:flex gap-4" justify="center">
          <NavbarItem className="pr-[2vw]">
            <a className="text-white dark:text-[#F5F3E7]  " href={pageRoute === 'collections' ? `/collections/search` : `/collections/${searchTerm}`}>
              Collections
            </a>
          </NavbarItem>
          <NavbarItem className="pr-[2vw]">
            <a className="text-white dark:text-[#F5F3E7]   " href={`/inaturalist/${searchTerm}`}>
              iNaturalist
            </a>
          </NavbarItem>
          <NavbarItem className="pr-[2vw]">
            <a className="text-white dark:text-[#F5F3E7]   " href={`/plantid`}>
              Plant.id
            </a>
          </NavbarItem>
          {props.page == 'home' &&
            <NavbarItem>
              <a className="text-white dark:text-[#F5F3E7] " href={'https://libguides.humboldt.edu/accessibility/3dherbarium'} target="_blank">
                Accessibility
              </a>
            </NavbarItem>
          }
        </NavbarContent>

        <NavbarContent as="div" className="items-center lg:hidden" justify="end">
          <button onClick={onOpen}>
            <SearchIcon size={22} width="" height="" />
          </button>
        </NavbarContent>

        <Modal className="lg:hidden" size={'full'} placement="top" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} hideCloseButton={true}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <NavbarItem>
                    <div className="flex items-center w-full ">
                      <Input
                        value={query}
                        onKeyDown={handleKeyPress}
                        id="iNatSearch"
                        onChange={async (e) => await autocomplete(e.target.value)}
                        onFocus={handleInputFocus}
                        style={{ width: "90%", transition: "width 0.5s ease-in-out", marginRight: 0 }}
                        autoComplete="off"
                        classNames={{
                          base: `flex-grow justify-center sm:justify-start h-10`,
                          mainWrapper: "h-full",
                          input: "text-small border-none focus:ring-0 focus:ring-offset-0",
                          inputWrapper: "h-full font-normal text-default-500 border-1 rounded-r-none rounded-l",
                        }}
                        placeholder={"Specimen Search"}
                        size="sm"
                        startContent={<SearchIcon size={16} width="" height="" />}
                        type="search"
                      />
                      <a id="search-button-inat" href={pageRoute && query ? `/${pageRoute}/${query}` : pageRoute && specimenName ? `/${pageRoute}/${specimenName}` : `/collections/${query}`}>
                        <button className="ml-0 text-white bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out h-10 px-4 rounded-l-none rounded-r">
                          <SearchIcon style={{ color: "black" }} size={22} width="" height="" />
                        </button>
                      </a>
                    </div>
                    <>
                      {searchResultsLoading ?
                        <>
                          <ul tabIndex={-1} className="absolute w-[87.5%] z-10 bg-white dark:bg-[#3d3d3d] shadow-md mt-1 max-h-60 overflow-auto rounded">
                            <li tabIndex={-1} style={{ marginRight: '2.75rem' }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer rounded-xl">
                              <Skeleton className="flex w-[110%] h-[1.3rem]" />
                            </li>
                            <li tabIndex={-1} style={{ marginRight: '2.75rem' }} className="p-2 hover:bg-gray-100 cursor-pointer rounded-xl">
                              <Skeleton className="flex w-[110%] h-[1.3rem]" />
                            </li>
                            <li tabIndex={-1} style={{ marginRight: '2.75rem' }} className="p-2 hover:bg-gray-100 cursor-pointer rounded-xl">
                              <Skeleton className="flex w-[110%] h-[1.3rem]" />
                            </li>
                          </ul>
                        </>
                        : autocompleteSearchResults.length > 0 ? (
                          <ul tabIndex={-1} className="absolute w-[87.5%] z-10 bg-white dark:bg-[#3d3d3d] shadow-md mt-1 rounded">
                            {autocompleteSearchResults.map((item: string, index: number) => (
                              <a tabIndex={0} key={item + index} onClick={() => setQuery(item)} href={`/${pageRoute}/${item}`} className='flex'>
                                <li value={item} ref={el => itemRefs.current[index] = el} tabIndex={-1} className={`p-2 w-[90vw] hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer rounded text-black dark:text-white ${index === highlightedIndex ? "bg-gray-100" : ""}`}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    {item}
                                    {isModel(item) && <strong className="text-[#FFC72C]">3D</strong>}
                                  </div>
                                </li>
                              </a>
                            ))}
                          </ul>
                        )
                          :
                          <></>
                      }
                    </>
                  </NavbarItem>
                </ModalHeader>
                <ModalBody></ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <NavbarContent className="hidden lg:flex pl-[0.5vw]" justify="end">
          <a href='/'>
            <Image src="../../../libLogo.svg" width={70} height={70} alt="Logo" className="pt-[3px]" />
          </a>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <h1 className="text-center">Navigation</h1>
            <Divider />
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <a
                className="w-full text-[#004C46] dark:text-white   "
                href={index === 0 ? "/" : index === 1 && pageRoute === 'collections' ? `/collections/search` : index === 1 ? `/collections/${searchTerm}` : index === 2 ? `/inaturalist/${searchTerm}` : index === 3 ? "/plantid" : index === 4 ? "https://libguides.humboldt.edu/accessibility/3dherbarium" : "#"}
              >
                {item}
              </a>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar >
    </>
  );
};

export default Header;