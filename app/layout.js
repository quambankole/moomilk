import Header from "./component/header";
import Footer from "./component/footer";
import "./globals.css";


export const metadata = {
  title: "Milk Photobooth",
  description: "Milk Photobooth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
