import logo from "../../assets/logo.svg";

function Footer() {
  return (
    <footer className="bg-white py-4 mt-10 h-72 flex flex-col justify-center items-center inset-shadow-md z-10">
      <img
        src={logo}
        alt="Logo"
        className="mx-auto mb-8"
        style={{ width: "80px", height: "auto" }}
      />
      <div className="container mx-auto text-center">
        <p>
          <span className="font-bold">Yapper</span> &copy;{" "}
          {new Date().getFullYear()}. All rights reserved.
        </p>
        <p className="italic">Created by Riaan la Grange</p>
      </div>
    </footer>
  );
}

export default Footer;
