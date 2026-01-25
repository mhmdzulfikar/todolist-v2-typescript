import React from "react";
import CardNav from "../components/CardNav";

const CardNavPage = () => {
  // ITEM DENGAN WARNA WARNI 
  const items = [
    {
    title: "Dashboard",
    color: "#1e1b4b",
    textColor: "#fff",
    links: [
     
      { label: "Home", href: "/home" }, 
      { label: "Dashboard", href: "/dashboard" },
      { label: "Todo List", href: "/todo" }, 
      { label: "Snipper Library", href: "/snippets" }  
    ]
  },
    // {
    //   title: "Projects",
    //   color: "#312e81", // Indigo Sedang
    //   textColor: "#fff",
    //   links: [{ label: "Active" }, { label: "History" }]
    // },
    // {
    //   title: "Settings",
    //   color: "#4338ca", // Indigo Terang
    //   textColor: "#fff",
    //   links: [{ label: "Profile" }, { label: "Security" }]
    // }
  ];

  return (
    <CardNav
      items={items}
      menuColor="#000"
    />
  );
};

export default CardNavPage;