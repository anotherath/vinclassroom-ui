import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dmUsers, pendingFriendRequests } from "../../data/mockData";
import { FiUserPlus } from "react-icons/fi";
import { setActiveRoom } from "../../store/slices/appSlice";
import { getUserColor } from "../../utils/userColor";
import { DMListHeader, DMListSection } from "./DMListComponents";

function FriendRequestItem({
  user,
  isDark,
  onAccept,
  onDecline,
  onNavigateToChat,
}) {
  const userColor = getUserColor(user.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center px-3 py-2.5 rounded-md gap-2.5 mb-1 cursor-pointer"
      style={{
        background: isHovered
          ? isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)"
          : "transparent",
        borderRadius: "8px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 relative cursor-pointer"
        style={{
          background: userColor,
          color: isDark ? "var(--bg-surface)" : "#fff",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigateToChat(user);
        }}
      >
        {user.avatar}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: user.isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      </div>
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateToChat(user);
        }}
      >
        <div className="text-sm font-medium" style={{ color: userColor }}>
          {user.name}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {user.mutualFriends} bạn chung
        </div>
      </div>
      <div className="flex gap-1.5">
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors text-xs font-bold"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAccept(user);
          }}
          title="Chấp nhận"
        >
          ✓
        </button>
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors text-xs font-bold"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDecline(user);
          }}
          title="Từ chối"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function DMItem({ dm, isDark, isActive, onClick, onAddFriend }) {
  const dmColor = getUserColor(dm.name);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    // Only navigate to the chat, don't show profile popup
    console.log("hello");
    onClick();
  };

  return (
    <div
      className="flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors gap-2.5 mb-0.5"
      style={{
        background: isActive
          ? "var(--primary-active)"
          : isHovered
            ? isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)"
            : "transparent",
        borderRadius: "8px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 relative"
        style={{
          background: dm.isBot ? "var(--tertiary-active)" : dmColor,
          color: dm.isBot
            ? "var(--tertiary)"
            : isDark
              ? "var(--bg-surface)"
              : "#fff",
        }}
      >
        {dm.avatar}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: dm.isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-medium" style={{ color: dmColor }}>
            {dm.name}
          </div>
        </div>
        <div
          className="text-xs mt-0.5 truncate"
          style={{
            color: dm.hasNewMessage
              ? "var(--text-primary)"
              : "var(--text-secondary)",
          }}
        >
          {dm.lastMessage}
        </div>
      </div>
      {!dm.isFriend && onAddFriend && (
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors flex-shrink-0"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddFriend(dm);
          }}
          title="Gửi lời mời kết bạn"
        >
          <FiUserPlus size={14} />
        </button>
      )}
    </div>
  );
}

function DMList({ activeRoom, setActiveRoom, searchQuery, setSearchQuery }) {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);
  const [pendingRequests, setPendingRequests] = useState(pendingFriendRequests);
  const [sentRequests, setSentRequests] = useState([]);

  const friends = dmUsers.filter((dm) => dm.isFriend);
  const nonFriends = dmUsers.filter((dm) => !dm.isFriend);

  const filteredFriends = friends.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredNonFriends = nonFriends.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isSearching = searchQuery.length > 0;

  const handleAcceptRequest = (user) => {
    setPendingRequests(pendingRequests.filter((u) => u.id !== user.id));
    console.log("Accepted friend request from:", user.name);
  };

  const handleDeclineRequest = (user) => {
    setPendingRequests(pendingRequests.filter((u) => u.id !== user.id));
    console.log("Declined friend request from:", user.name);
  };

  const handleNavigateToChat = (user) => {
    if (setActiveRoom) {
      setActiveRoom(user.id);
    } else {
      dispatch(setActiveRoom(user.id));
    }
  };

  const handleAddFriend = (user) => {
    setSentRequests([...sentRequests, user.id]);
    console.log("Sent friend request to:", user.name);
  };

  return (
    <div
      className="w-60 min-w-60 flex flex-col h-screen border-r"
      style={{
        background: "var(--bg-surface-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      <DMListHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1 overflow-y-auto p-2 relative">
        {/* Search Results */}
        {isSearching && (
          <>
            {/* Friend matches */}
            <DMListSection title="Bạn bè">
              {filteredFriends.map((dm) => (
                <DMItem
                  key={dm.id}
                  dm={dm}
                  isDark={isDark}
                  isActive={activeRoom === dm.id}
                  onClick={() => setActiveRoom(dm.id)}
                />
              ))}
            </DMListSection>

            {/* Non-friend matches */}
            <DMListSection title="Tin nhắn chưa kết bạn">
              {filteredNonFriends.map((dm) => (
                <DMItem
                  key={dm.id}
                  dm={dm}
                  isDark={isDark}
                  isActive={activeRoom === dm.id}
                  onClick={() => setActiveRoom(dm.id)}
                  onAddFriend={handleAddFriend}
                />
              ))}
            </DMListSection>

            {/* Friend Requests in search */}
            <DMListSection title="Lời mời kết bạn">
              {pendingRequests
                .filter((user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((user) => (
                  <FriendRequestItem
                    key={user.id}
                    user={user}
                    isDark={isDark}
                    onAccept={handleAcceptRequest}
                    onDecline={handleDeclineRequest}
                    onNavigateToChat={handleNavigateToChat}
                  />
                ))}
            </DMListSection>

            {filteredFriends.length === 0 &&
              filteredNonFriends.length === 0 &&
              pendingRequests.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length === 0 && (
                <div
                  className="text-center py-8 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Không tìm thấy kết quả
                </div>
              )}
          </>
        )}

        {/* Default View - No Search */}
        {!isSearching && (
          <>
            {/* Friends List */}
            <DMListSection title="Bạn bè">
              {friends.map((dm) => (
                <DMItem
                  key={dm.id}
                  dm={dm}
                  isDark={isDark}
                  isActive={activeRoom === dm.id}
                  onClick={() => setActiveRoom(dm.id)}
                />
              ))}
            </DMListSection>

            {/* Non-friends with conversations */}
            <DMListSection title="Tin nhắn chưa kết bạn">
              {nonFriends.map((dm) => (
                <DMItem
                  key={dm.id}
                  dm={dm}
                  isDark={isDark}
                  isActive={activeRoom === dm.id}
                  onClick={() => setActiveRoom(dm.id)}
                  onAddFriend={handleAddFriend}
                />
              ))}
            </DMListSection>

            {/* Friend Requests Section */}
            <DMListSection title="Lời mời kết bạn">
              {pendingRequests.map((user) => (
                <FriendRequestItem
                  key={user.id}
                  user={user}
                  isDark={isDark}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                  onNavigateToChat={handleNavigateToChat}
                />
              ))}
            </DMListSection>
          </>
        )}
      </div>
    </div>
  );
}

export default DMList;
