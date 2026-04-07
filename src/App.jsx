import { useSelector } from "react-redux";
import "./App.css";
import Sidebar from "./components/Sidebar";
import RoomList from "./components/RoomList";
import ChatArea from "./components/ChatArea";
import MemberList from "./components/MemberList";
import CreateSpace from "./components/createspace/CreateSpace";

function App() {
  const { activeView, activeSpace, activeRoom, searchQuery, isSettings } =
    useSelector((state) => state.app);

  const currentView = isSettings ? "settings" : activeView;

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
