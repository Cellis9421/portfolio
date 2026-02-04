import INavigation from "../../@types/INavigation";

const NAVIGATION: INavigation = {
  items: [
    { iconKey: "home", label: "Home", href: "/" },
    { iconKey: "about", label: "About", href: "/about" },
    { iconKey: "projects", label: "Projects", href: "/projects" },
    { iconKey: "blog", label: "Blog", href: "https://blog.calvinellis.io/" },
    { iconKey: "contact", label: "Contact", href: "/contact" },
  ],
};

export default NAVIGATION;
