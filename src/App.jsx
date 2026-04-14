import { useSelector } from "react-redux";
import "./App.css";
import Sidebar from "./components/Sidebar";
import RoomList from "./components/RoomList";
import ChatArea from "./components/ChatArea";
import MemberList from "./components/MemberList";
import CreateSpace from "./components/createspace/CreateSpace";
import LoginPage from "./pages/LoginPage";

function App() {
  const { activeView, activeSpace, activeRoom, searchQuery, isSettings } =
    useSelector((state) => state.app);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const currentView = isSettings ? "settings" : activeView;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <Sidebar />
      {currentView === "createSpace" ? (
        <>
          <RoomList activeView="createSpace" />
          <CreateSpace />
          <MemberList activeView="createSpace" />
        </>
      ) : (
        <>
          <RoomList
            activeView={currentView}
            activeSpace={activeSpace}
            activeRoom={activeRoom}
            searchQuery={searchQuery}
          />
          <ChatArea activeView={currentView} activeRoom={activeRoom} />
          <MemberList activeView={currentView} activeRoom={activeRoom} />
        </>
      )}
    </div>
  );
}

export default App;
