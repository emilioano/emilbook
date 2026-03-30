import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import LoginModule from "./pages/LoginModule.tsx";
import HomePage from "./pages/HomePage.tsx";
import UserArea from "./pages/UserArea.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SearchPage from "./components/PostsSearchModule.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginModule />} />
          <Route
            path="/userarea"
            element={
              <ProtectedRoute>
                <UserArea />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={<SearchPage onEvent={() => window.location.reload()} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
