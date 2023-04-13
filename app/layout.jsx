import NavBar from "@/components/NavBar";
import AuthContext from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "BookMyTable",
  description: "Created by Nazmuz Sakib | Inspired from OpenTable",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <AuthContext>
            <main className="max-w-screen-2xl m-auto bg-white">
              <NavBar />
              {children}
            </main>
          </AuthContext>
        </main>
      </body>
    </html>
  );
}
