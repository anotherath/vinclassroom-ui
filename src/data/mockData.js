// Mock data for the university learning app

export const spaces = [
  {
    id: "toan-cao-cap",
    name: "Toán cao cấp",
    icon: "function",
    hasNotification: true,
  },
  {
    id: "lap-trinh-ai",
    name: "Lập trình AI",
    icon: "robot",
    hasNotification: false,
  },
  {
    id: "nhom-project",
    name: "Nhóm Project",
    icon: "folder",
    hasNotification: true,
  },
  {
    id: "on-thi-cuoi-ky",
    name: "Ôn thi cuối kỳ",
    icon: "pencil",
    hasNotification: false,
  },
];

export const rooms = {
  "toan-cao-cap": [
    {
      id: "bai-giang-1",
      name: "bai-giang-1",
      hasNotification: true,
      unreadCount: 3,
    },
    { id: "bai-tap-tuan-2", name: "bai-tap-tuan-2", hasNotification: false },
    {
      id: "thao-luan-midterm",
      name: "thao-luan-midterm",
      hasNotification: true,
      unreadCount: 5,
    },
    { id: "tai-lieu", name: "tai-lieu", hasNotification: false },
    {
      id: "tro-ly-ai",
      name: "tro-ly-ai",
      icon: "🤖",
      hasNotification: false,
      isBot: true,
    },
  ],
  "lap-trinh-ai": [
    { id: "python-co-ban", name: "python-co-ban", hasNotification: false },
    {
      id: "machine-learning",
      name: "machine-learning",
      hasNotification: true,
      unreadCount: 2,
    },
    { id: "deep-learning", name: "deep-learning", hasNotification: false },
    {
      id: "tro-ly-ai",
      name: "tro-ly-ai",
      icon: "🤖",
      hasNotification: false,
      isBot: true,
    },
  ],
  "nhom-project": [
    { id: "ke-hoach", name: "ke-hoach", hasNotification: false },
    {
      id: "phan-cong",
      name: "phan-cong",
      hasNotification: true,
      unreadCount: 1,
    },
    {
      id: "tro-ly-ai",
      name: "tro-ly-ai",
      icon: "🤖",
      hasNotification: false,
      isBot: true,
    },
  ],
  "on-thi-cuoi-ky": [
    { id: "de-cuong", name: "de-cuong", hasNotification: false },
    {
      id: "bai-tap-on",
      name: "bai-tap-on",
      hasNotification: true,
      unreadCount: 8,
    },
    {
      id: "tro-ly-ai",
      name: "tro-ly-ai",
      icon: "🤖",
      hasNotification: false,
      isBot: true,
    },
  ],
};

export const messages = {
  "bai-giang-1": [
    {
      id: 1,
      sender: "Minh",
      avatar: "M",
      timestamp: "10:30",
      content: "Mọi người ơi, đạo hàm của hàm số f(x) = x³ + 2x là gì nhỉ?",
      isPinned: false,
      isEdited: true,
      reactions: [{ emoji: "🤔", count: 2, users: ["Linh", "Huy"] }],
    },
    {
      id: 2,
      sender: "Linh",
      avatar: "L",
      timestamp: "10:32",
      content: "Dùng quy tắc lũy thừa thôi: f'(x) = 3x² + 2",
      isPinned: true,
      reactions: [
        { emoji: "❤️", count: 3, users: ["Minh", "Huy", "Tuan"] },
        { emoji: "👍", count: 1, users: ["Tuan"] },
      ],
    },
    {
      id: 3,
      sender: "Huy",
      avatar: "H",
      timestamp: "10:33",
      content: "Đúng rồi, mình cũng ra kết quả đó. Cảm ơn Linh nhé!",
      isPinned: false,
      reactions: [{ emoji: "😄", count: 2, users: ["Minh", "Linh"] }],
    },
    {
      id: 4,
      sender: "Minh",
      avatar: "M",
      timestamp: "10:35",
      content: "Ah ra vậy, mình quên mất quy tắc chuỗi. Cảm ơn mọi người!",
      isPinned: false,
    },
    {
      id: 5,
      sender: "Linh",
      avatar: "L",
      timestamp: "10:36",
      content: "Mình gửi file PDF tổng hợp các quy tắc đạo hàm ở trên nhé",
      isPinned: false,
      hasAttachment: true,
      attachmentName: "dao_ham_tong_hop.pdf",
      reactions: [
        { emoji: "🙏", count: 4, users: ["Minh", "Huy", "Tuan", "You"] },
      ],
    },
    {
      id: 6,
      sender: "Tuan",
      avatar: "T",
      timestamp: "10:40",
      content: "File hay quá, cảm ơn Linh nhiều!",
      isPinned: false,
      replyTo: {
        id: 5,
        sender: "Linh",
        content: "Mình gửi file PDF tổng hợp các quy tắc đạo hàm ở trên nhé",
      },
    },
    {
      id: 7,
      sender: "Minh",
      avatar: "M",
      timestamp: "10:42",
      content:
        "Cho mình hỏi thêm: tích phân của sin(x) từ 0 đến π bằng bao nhiêu?",
      isPinned: false,
      replyTo: {
        id: 2,
        sender: "Linh",
        content: "Dùng quy tắc lũy thừa thôi: f'(x) = 3x² + 2",
      },
    },
    {
      id: 8,
      sender: "Huy",
      avatar: "H",
      timestamp: "10:45",
      content:
        "∫sin(x)dx từ 0 đến π = [-cos(x)] từ 0 đến π = -cos(π) - (-cos(0)) = 1 + 1 = 2",
      isPinned: true,
      reactions: [
        { emoji: "🎉", count: 2, users: ["Minh", "Linh"] },
        { emoji: "💯", count: 1, users: ["Tuan"] },
      ],
    },
  ],
  "tro-ly-ai": [
    {
      id: 1,
      sender: "You",
      avatar: "Y",
      timestamp: "14:20",
      content: "Giải thích giúp mình đạo hàm là gì?",
      isPinned: false,
    },
    {
      id: 2,
      sender: "StudyBot",
      avatar: "🤖",
      timestamp: "14:20",
      content:
        "Đạo hàm là tốc độ thay đổi của một hàm số theo biến số. Nói cách khác, đạo hàm tại một điểm cho biết hệ số góc của tiếp tuyến với đồ thị hàm số tại điểm đó.",
      isPinned: true,
      isBot: true,
    },
    {
      id: 3,
      sender: "You",
      avatar: "Y",
      timestamp: "14:21",
      content: "Có ví dụ cụ thể không?",
      isPinned: false,
    },
    {
      id: 4,
      sender: "StudyBot",
      avatar: "🤖",
      timestamp: "14:21",
      content:
        "Ví dụ: Vận tốc là đạo hàm của quãng đường theo thời gian. Nếu s(t) = t², thì v(t) = s'(t) = 2t. Tại t = 3s, vận tốc là 6 m/s.",
      isPinned: false,
      isBot: true,
    },
    {
      id: 5,
      sender: "You",
      avatar: "Y",
      timestamp: "14:23",
      content: "Quy tắc chuỗi là gì?",
      isPinned: false,
    },
    {
      id: 6,
      sender: "StudyBot",
      avatar: "🤖",
      timestamp: "14:23",
      content:
        "Quy tắc chuỗi dùng để tính đạo hàm của hàm hợp. Nếu y = f(g(x)), thì y' = f'(g(x)) · g'(x). Ví dụ: y = sin(x²) → y' = cos(x²) · 2x",
      isPinned: false,
      isBot: true,
    },
  ],
};

export const directMessages = {
  minh: [
    {
      id: 1,
      sender: "Minh",
      avatar: "M",
      timestamp: "09:15",
      content: "Cậu có tài liệu ôn thi không?",
      isPinned: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "Y",
      timestamp: "09:20",
      content: "Có nè, mình gửi cho cậu nhé",
      isPinned: false,
    },
    {
      id: 3,
      sender: "Minh",
      avatar: "M",
      timestamp: "09:21",
      content: "Cảm ơn cậu nhiều!",
      isPinned: false,
    },
    {
      id: 4,
      sender: "You",
      avatar: "Y",
      timestamp: "09:25",
      content: "Không có gì, cùng ôn thi nhé!",
      isPinned: false,
    },
  ],
  linh: [
    {
      id: 1,
      sender: "Linh",
      avatar: "L",
      timestamp: "08:00",
      content: "Bài tập trang 45 cậu làm xong chưa?",
      isPinned: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "Y",
      timestamp: "08:30",
      content: "Mình mới làm được nửa thôi",
      isPinned: false,
    },
    {
      id: 3,
      sender: "Linh",
      avatar: "L",
      timestamp: "08:35",
      content: "Câu 5 khó quá, cậu giải giúp mình được không?",
      isPinned: false,
    },
  ],
  tuan: [
    {
      id: 1,
      sender: "Tuan",
      avatar: "T",
      timestamp: "Yesterday",
      content: "Project deadline là khi nào nhỉ?",
      isPinned: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "Y",
      timestamp: "Yesterday",
      content: "Cuối tháng này rồi",
      isPinned: false,
    },
  ],
  "studybot-dm": [
    {
      id: 1,
      sender: "You",
      avatar: "Y",
      timestamp: "16:00",
      content: "Help me with calculus",
      isPinned: false,
    },
    {
      id: 2,
      sender: "StudyBot",
      avatar: "🤖",
      timestamp: "16:00",
      content:
        "Sure! What specific topic in calculus would you like help with?",
      isPinned: false,
      isBot: true,
    },
  ],
  hoa: [
    {
      id: 1,
      sender: "Hoa",
      avatar: "H",
      timestamp: "15:30",
      content:
        "Chào bạn, mình cùng lớp toán cao cấp nhé! Cho mình hỏi về bài tập tuần 2 với?",
      isPinned: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "Y",
      timestamp: "15:35",
      content: "Chào bạn, bạn hỏi đi mình nghe nè",
      isPinned: false,
    },
    {
      id: 3,
      sender: "Hoa",
      avatar: "H",
      timestamp: "15:40",
      content:
        "Câu 3 phần giới hạn mình không hiểu, bạn giải thích giúp mình được không?",
      isPinned: false,
    },
  ],
  dung: [],
  mai: [],
};

export const members = [
  { id: "minh", name: "Minh", avatar: "M", isOnline: true, isBot: false },
  { id: "linh", name: "Linh", avatar: "L", isOnline: true, isBot: false },
  { id: "huy", name: "Huy", avatar: "H", isOnline: false, isBot: false },
  { id: "tuan", name: "Tuấn", avatar: "T", isOnline: true, isBot: false },
  {
    id: "studybot",
    name: "StudyBot",
    avatar: "🤖",
    isOnline: true,
    isBot: true,
    label: "Trợ lý",
  },
];

export const recentFiles = [
  { id: 1, name: "dao_ham_tong_hop.pdf", sharedBy: "Linh", date: "10:36" },
  { id: 2, name: "bai_giang_tuan1.pptx", sharedBy: "Minh", date: "Yesterday" },
  { id: 3, name: "de_cuong_on_tap.docx", sharedBy: "Huy", date: "2 days ago" },
];

export const dmUsers = [
  {
    id: "minh",
    name: "Minh",
    avatar: "M",
    isOnline: true,
    lastMessage: "Cảm ơn cậu nhiều!",
    hasNewMessage: true,
    isFriend: true,
    email: "minh@vinclassroom.edu.vn",
    mutualFriends: 5,
    sharedSpaces: ["Toán cao cấp", "Nhóm Project"],
  },
  {
    id: "linh",
    name: "Linh",
    avatar: "L",
    isOnline: true,
    lastMessage: "Câu 5 khó quá...",
    hasNewMessage: true,
    isFriend: true,
    email: "linh@vinclassroom.edu.vn",
    mutualFriends: 8,
    sharedSpaces: ["Toán cao cấp", "Lập trình AI"],
  },
  {
    id: "tuan",
    name: "Tuấn",
    avatar: "T",
    isOnline: false,
    lastMessage: "Project deadline là khi nào?",
    hasNewMessage: false,
    isFriend: true,
    email: "tuan@vinclassroom.edu.vn",
    mutualFriends: 3,
    sharedSpaces: ["Nhóm Project"],
  },
  {
    id: "studybot-dm",
    name: "StudyBot",
    avatar: "🤖",
    isOnline: true,
    lastMessage: "What specific topic...",
    hasNewMessage: false,
    isBot: true,
    isFriend: true,
    email: "studybot@vinclassroom.edu.vn",
    mutualFriends: 0,
    sharedSpaces: [],
  },
  {
    id: "hoa",
    name: "Hoa",
    avatar: "H",
    isOnline: true,
    lastMessage: "Chào bạn, mình cùng lớp toán nhé!",
    hasNewMessage: true,
    isFriend: false,
    email: "hoa@vinclassroom.edu.vn",
    mutualFriends: 2,
    sharedSpaces: ["Toán cao cấp"],
  },
  {
    id: "dung",
    name: "Dũng",
    avatar: "D",
    isOnline: false,
    lastMessage: "Lời mời kết bạn",
    hasNewMessage: false,
    isFriend: false,
    email: "dung@vinclassroom.edu.vn",
    mutualFriends: 3,
    sharedSpaces: [],
  },
  {
    id: "mai",
    name: "Mai",
    avatar: "M",
    isOnline: true,
    lastMessage: "Lời mời kết bạn",
    hasNewMessage: false,
    isFriend: false,
    email: "mai@vinclassroom.edu.vn",
    mutualFriends: 5,
    sharedSpaces: [],
  },
];

// Pending friend requests
export const pendingFriendRequests = [
  {
    id: "dung",
    name: "Dũng",
    avatar: "D",
    isOnline: false,
    mutualFriends: 3,
  },
  {
    id: "mai",
    name: "Mai",
    avatar: "M",
    isOnline: true,
    mutualFriends: 5,
  },
];

// Suggested friends (search results)
export const suggestedFriends = [
  {
    id: "long",
    name: "Long",
    avatar: "L",
    isOnline: true,
    mutualFriends: 2,
  },
  {
    id: "hong",
    name: "Hồng",
    avatar: "H",
    isOnline: false,
    mutualFriends: 1,
  },
];
