import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, MessageSquare, ChevronRight, HelpCircle, 
  Coffee, Users, Layers, Zap, Info, Play, CheckCircle2,
  Calendar, RotateCcw, ListCollapse, Printer, Receipt, ArrowRight, CornerDownRight
} from 'lucide-react';

interface MisaAvaAssistantProps {
  currentScreen: string;
  onNavigateToScreen?: (screen: any) => void;
  onQuickReset?: () => void;
  customTables?: any[];
  setCustomTables?: (tables: any[]) => void;
}

interface Message {
  sender: 'user' | 'ava';
  text: string;
  timestamp: string;
  options?: string[];
  action?: string;
}

export default function MisaAvaAssistant({ 
  currentScreen, 
  onNavigateToScreen, 
  onQuickReset,
  customTables,
  setCustomTables
}: MisaAvaAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState<string | null>(
    'Xin chào! Mình là MISA AVA. Click để xem hướng dẫn thiết lập nhanh cho Quán Coffee!'
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Clear notification after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Map screen key to Vietnamese display name
  const getScreenName = (screen: string) => {
    switch (screen) {
      case 'tables': return 'Sơ đồ phòng bàn';
      case 'orderList': return 'Danh sách Order';
      case 'order': return 'Ghi món & Menu';
      case 'payment': return 'Thanh toán & Thu tiền';
      case 'invoices': return 'Hóa đơn điện tử';
      case 'reservations': return 'Quản lý Đặt chỗ';
      case 'tourguide': return 'Hướng dẫn Tourguide';
      default: return 'Trang chủ POS';
    }
  };

  // Get suggested topics based on current screen
  const getSuggestedTopics = (screen: string) => {
    switch (screen) {
      case 'tables':
        return [
          'Cách mở bàn cho khách?',
          'Làm sao để thêm bàn nhanh trực tiếp?',
          'Quy tắc ghép bàn liền kề thế nào?',
          'Mẹo quản lý quán Cafe 3 tầng?',
        ];
      case 'order':
        return [
          'Tại sao Trà sữa gộp dòng, Phở lại tạo dòng mới?',
          'Cách áp dụng chương trình khuyến mãi?',
          'Hướng dẫn thêm topping / ghi chú món?',
          'Làm thế nào để in tạm tính?',
        ];
      case 'reservations':
        return [
          'Cách ghi nhận khách đặt cọc trước?',
          'Nhận bàn khi khách đặt chỗ đến thế nào?',
          'Mẹo sắp xếp bàn dịp lễ cao điểm?',
        ];
      case 'invoices':
        return [
          'Cách phát hành hóa đơn điện tử e-Invoice?',
          'Làm sao để hủy hóa đơn viết sai?',
          'Báo cáo doanh thu hóa đơn cuối ngày?',
        ];
      case 'orderList':
        return [
          'Lọc đơn giao hàng & mang về thế nào?',
          'Xử lý đơn online từ Grab/ShopeeFood?',
          'Tính năng gộp bàn & chuyển bàn ở đâu?',
        ];
      default:
        return [
          'Hướng dẫn thiết lập ban đầu Quán Coffee?',
          'Quy tắc gộp món tự động (Domain Logic)?',
          'Mở sơ đồ bàn và phục vụ khách hàng?',
        ];
    }
  };

  // Get responses based on topic or user keyword
  const getResponseText = (query: string): { text: string; options?: string[]; action?: string } => {
    const q = query.toLowerCase();

    // 1. Tables Screen Guides
    if (q.includes('mở bàn') || q.includes('mo ban')) {
      return {
        text: `**Hướng dẫn mở bàn phục vụ khách:**\n\n1. Bạn đang ở màn hình **Sơ đồ phòng bàn**.\n2. Hãy chạm vào bất kỳ **Bàn trống** nào (viền nét đứt màu xám).\n3. Hệ thống sẽ tự động mở hóa đơn mới và chuyển bạn trực tiếp sang màn hình **Ghi món (Order)**.\n4. Chọn các món uống/bánh khách gọi và nhấn **Gửi Bếp/Bar** để lưu thông tin.\n\n*💡 Mẹo: Trạng thái bàn sẽ tự động chuyển sang màu xanh dương (Đang phục vụ) ngay khi có món ăn được thêm.*`
      };
    }
    if (q.includes('thêm bàn nhanh') || q.includes('them ban nhanh') || q.includes('thêm bàn') || q.includes('them ban')) {
      return {
        text: `**Hướng dẫn thêm bàn mới trực tiếp trên Sơ đồ bàn:**\n\n1. Tại màn hình **Sơ đồ phòng bàn**, bạn nhìn xuống góc trái phía dưới của thanh menu chọn tầng.\n2. Có một nút màu xanh dương đậm mang tên **[THÊM BÀN NHANH]**.\n3. Hãy click vào đó, một bảng thông báo nhỏ sẽ hiện ra hỏi bạn tên bàn mới (Ví dụ: *Bàn 113*).\n4. Nhập tên bàn và click **Đồng ý**. Bàn mới sẽ ngay lập tức xuất hiện tại tầng và khu vực bạn đang chọn với trạng thái trống, sẵn sàng đón khách!\n\n*💡 Mẹo: Bạn có thể thêm không giới hạn số bàn để đáp ứng nhu cầu tăng tầng, tăng bàn vào dịp lễ tết.*`
      };
    }
    if (q.includes('ghép bàn') || q.includes('ghep ban')) {
      return {
        text: `**Quy tắc ghép bàn liền kề thông minh:**\n\n1. Khi bạn xếp bàn đặt chỗ hoặc mở bàn cho nhóm khách đông (từ 10 người trở lên), hệ thống CUKCUK sẽ tự động đề xuất và **ghép các bàn trống liền kề** trong cùng khu vực.\n2. Hệ thống sẽ tự động gộp các bàn này lại dưới dạng một nhóm để nhân viên dễ dàng phục vụ.\n3. Bạn cũng có thể click chọn nhiều bàn cùng lúc khi thao tác xếp chỗ.\n\n*💡 Mẹo: Tổng số ghế tích lũy của nhóm bàn sẽ được cộng dồn để đảm bảo đủ chỗ ngồi cho lượng khách đoàn.*`
      };
    }
    if (q.includes('3 tầng') || q.includes('3 tang') || q.includes('quản lý tầng') || q.includes('quan ly tang')) {
      return {
        text: `**Mẹo tối ưu vận hành Quán Coffee 3 tầng:**\n\n- **Phân chia khu vực (Zones)**: Bạn đã thiết lập hoàn hảo 3 tầng (Tầng 1, Tầng 2, Tầng 3), mỗi tầng có 12 bàn để quản lý.\n- **Gán nhân viên phục vụ**: Nên phân công cố định 1-2 nhân viên phụ trách mỗi tầng để tốc độ phục vụ nhanh nhất.\n- **Sử dụng máy in bếp/bar**: Đơn đồ uống từ Tầng 2, Tầng 3 khi order sẽ tự động in phiếu tại Quầy Bar (Tầng 1), giúp nhân viên pha chế thực hiện ngay mà không cần chạy đi chạy lại giữa các tầng!\n- **Theo dõi trạng thái màu sắc**: \n  - Màu xám: Bàn trống.\n  - Màu xanh dương: Đang có khách.\n  - Biểu tượng hóa đơn cam nhấp nháy: Khách yêu cầu thanh toán.`
      };
    }

    // 2. Order/Menu Screen Guides
    if (q.includes('gộp dòng') || q.includes('gop dong') || q.includes('tạo dòng') || q.includes('gộp món') || q.includes('gop mon')) {
      return {
        text: `**Quy tắc gộp món tự động (Domain Logic đặc thù):**\n\nĐể tối ưu tốc độ gọi món và cá nhân hóa cho khách hàng, hệ thống tuân thủ nghiêm ngặt quy tắc nghiệp vụ sau:\n\n1. **Đồ uống (Beverages) & Đồ đóng chai**: \n   - Khi thêm đồ uống (Ví dụ: *Cà phê Muối Sông Hồng, Trà Đào Cam Sả, Nước ngọt*), hệ thống sẽ **TỰ ĐỘNG GỘP NGAY** vào dòng sản phẩm cũ nếu trùng ID, giúp danh sách gọn gàng và pha chế dễ theo dõi.\n\n2. **Món ăn / Bánh (Food items)**:\n   - Hệ thống **KHÔNG TỰ ĐỘNG GỘP DÒNG** khi thêm từ menu. Mỗi lần chạm sẽ tạo một dòng mới độc lập.\n   - Điều này giúp nhân viên dễ dàng thêm ghi chú riêng (Ví dụ: *Bánh Tiramisu ít ngọt, Croissant hâm nóng giòn*) cho từng đĩa bánh của từng khách.\n   - Các dòng món ăn chỉ tự động gộp lại nếu chúng hoàn toàn trùng khớp về ID, Topping/Addons và Ghi chú giống hệt nhau.\n\n*💡 Đây là tiêu chuẩn thiết kế POS cao cấp của MISA giúp triệt tiêu nhầm lẫn khi tùy biến món ăn!*`
      };
    }
    if (q.includes('khuyến mãi') || q.includes('khuyen mai') || q.includes('chương trình')) {
      return {
        text: `**Cách áp dụng chương trình khuyến mãi giảm giá:**\n\n1. Tại màn hình **Ghi món (Order)**, trong giỏ hàng bên tay trái, bạn click vào nút **Khuyến mãi** (biểu tượng thẻ giảm giá).\n2. Danh sách các chương trình khuyến mãi hiện dụng sẽ hiện ra (Ví dụ: *Giảm giá 10% Menu Mùa Hè*).\n3. Tích chọn khuyến mãi phù hợp. Hệ thống sẽ áp dụng trực tiếp và hiển thị chi tiết số tiền được giảm một cách trực quan.\n\n*💡 Lưu ý thiết kế: Khuyến mãi được hiển thị dưới dạng nhãn chữ nghiêng màu đỏ thanh lịch kèm icon nhỏ ở dưới món ăn để không làm rối mắt người dùng.*`
      };
    }
    if (q.includes('topping') || q.includes('ghi chú') || q.includes('ghi chu')) {
      return {
        text: `**Hướng dẫn tùy chỉnh món ăn, thêm topping & ghi chú:**\n\n1. Trong danh sách order của giỏ hàng, chạm vào món cần tùy chỉnh.\n2. Một hộp thoại tùy chỉnh sẽ hiện ra cho phép bạn:\n   - Chọn các loại Topping/Addons đi kèm (Ví dụ: *Thêm trân châu hoàng kim, thêm thạch dừa*).\n   - Nhập ghi chú đặc biệt cho nhà bếp/quầy bar (Ví dụ: *Ít đá, 50% đường, hâm nóng*).\n3. Bấm **XÁC NHẬN**. Hóa đơn sẽ tự động cập nhật và phân tách dòng nếu cần thiết.`
      };
    }
    if (q.includes('tạm tính') || q.includes('tam tinh') || q.includes('in hóa đơn') || q.includes('in hoa don')) {
      return {
        text: `**Hướng dẫn In tạm tính cho khách hàng:**\n\n1. Tại góc dưới cùng bên phải giỏ hàng màn hình Order, bạn sẽ thấy nút **[Lưu tạm tính]** màu xanh lá nổi bật.\n2. Click vào đó để lưu thông tin đơn nháp và gửi lệnh in hóa đơn tạm tính ra máy in hóa đơn ở quầy.\n3. Khách hàng xem trước hóa đơn tạm tính để xác nhận món và số tiền trước khi thanh toán chính thức.\n4. Trạng thái bàn trên sơ đồ sẽ tự động nhấp nháy biểu tượng hóa đơn màu cam để báo hiệu bàn này đang **Chờ thanh toán**.`
      };
    }

    // 3. Reservations Screen Guides
    if (q.includes('đặt cọc') || q.includes('dat coc')) {
      return {
        text: `**Cách ghi nhận tiền đặt cọc đặt chỗ trước:**\n\n1. Tại màn hình **Đặt chỗ**, bấm **[Đặt chỗ mới]** hoặc click đúp vào một lượt đặt chỗ chờ xác nhận.\n2. Tại form điền thông tin, kéo xuống mục **Tiền đặt cọc**.\n3. Nhập số tiền khách cọc trước (Ví dụ: *200,000đ*) và chọn phương thức đặt cọc (Tiền mặt, Chuyển khoản, Thẻ).\n4. Bấm **Lưu**. Tiền cọc này sẽ tự động được khấu trừ trực tiếp vào hóa đơn thanh toán cuối cùng của khách khi thanh toán tại bàn!`
      };
    }
    if (q.includes('nhận bàn') || q.includes('nhan ban')) {
      return {
        text: `**Quy trình nhận bàn cho khách đặt chỗ:**\n\n1. Khi khách đặt chỗ đến quán, mở tab **Đặt chỗ**.\n2. Tìm lượt đặt chỗ của khách (Ví dụ: *Nguyễn Hoàng Nam*), nhấn nút **[Nhận bàn]**.\n3. Hệ thống sẽ hiển thị Sơ đồ bàn kèm các bàn được đề xuất (gợi ý bàn phù hợp với số lượng khách).\n4. Chọn bàn trống phù hợp và xác nhận. Trạng thái đặt chỗ sẽ tự động chuyển sang **Đã nhận bàn (Seated)** và mở ngay màn hình gọi món, mang theo toàn bộ danh sách các món khách đã đặt trước (nếu có)!`
      };
    }

    // 4. Invoices Screen Guides
    if (q.includes('hóa đơn điện tử') || q.includes('hoa don dien tu') || q.includes('e-invoice') || q.includes('e invoice') || q.includes('xuất hóa đơn')) {
      return {
        text: `**Quy trình xuất hóa đơn điện tử e-Invoice chuẩn thông tư MISA:**\n\n1. Chuyển sang màn hình **Hóa đơn** từ menu sidebar bên trái.\n2. Chọn hóa đơn đã thanh toán cần xuất hóa đơn điện tử.\n3. Nhấn vào nút **[Phát hành HĐĐT]** ở góc phải.\n4. Điền thông tin mã số thuế, tên công ty, địa chỉ và email nhận hóa đơn của khách hàng.\n5. Bấm **Xác nhận phát hành**. Hệ thống sẽ tự động ký số và gửi hóa đơn điện tử trực tiếp tới cơ quan thuế và email của khách hàng chỉ trong 3 giây!`
      };
    }
    if (q.includes('hủy hóa đơn') || q.includes('huy hoa don') || q.includes('hủy') || q.includes('huy')) {
      return {
        text: `**Cách hủy hoặc điều chỉnh hóa đơn đã thanh toán:**\n\n1. Tại màn hình **Hóa đơn**, tìm hóa đơn muốn xử lý.\n2. Click vào hóa đơn để xem chi tiết.\n3. Nếu hóa đơn chưa xuất HĐĐT, bạn có thể nhấn **Hủy thanh toán** để đưa đơn về trạng thái chờ xử lý.\n4. Nếu hóa đơn đã phát hành HĐĐT, bạn hãy bấm **[Yêu cầu hủy/Điều chỉnh HĐ]**. Nhập lý do hủy hóa đơn (Ví dụ: *Sai thông tin khách hàng, Khách đổi trả món*).\n5. Hệ thống sẽ lập biên bản hủy hóa đơn điện tử theo đúng quy định pháp luật.`
      };
    }

    // 5. Setup & Reset
    if (q.includes('thiết lập') || q.includes('thiet lap') || q.includes('cài đặt') || q.includes('cai dat') || q.includes('coffee') || q.includes('cà phê')) {
      return {
        text: `**Chào mừng bạn đến với Quán Coffee của bạn!**\n\nHệ thống đã được cấu hình tối ưu tự động dựa trên chân dung khách hàng của bạn:\n\n- **Quy mô**: 3 tầng, mỗi tầng được bố trí sẵn 12 bàn trống tinh tươm (Bàn 101-112, Bàn 201-212, Bàn 301-312).\n- **Nhân sự**: Đã tạo sẵn 5 tài khoản nhân viên phục vụ (*Minh Trí, Kim Ngân, Hoàng Hải, Minh Thư, Quốc Huy*) giúp phân ca dễ dàng.\n- **Thực đơn đặc trưng**: Đã nạp sẵn danh sách Đồ uống theo mùa độc đáo:\n  - *Mùa Xuân*: Trà Hoa Cúc Mật Ong Nhãn Nhục\n  - *Mùa Hè*: Trà Đào Cam Sả Thảo Mộc\n  - *Mùa Thu*: Cà phê Muối Sông Hồng\n  - *Mùa Đông*: Cà phê Trứng Hà Nội\n  - Các loại bánh ngọt đi kèm (*Tiramisu, Croissant bơ tỏi*).\n\n*Bạn muốn tôi hướng dẫn thao tác gì trước?*`,
        options: [
          'Thực hiện một đơn hàng mẫu?',
          'Cách thêm bàn nhanh trực tiếp?',
          'Quy tắc gộp món tự động (Domain Logic)?',
          'Khởi tạo nhà hàng mới sạch dữ liệu?'
        ]
      };
    }
    if (q.includes('đơn hàng mẫu') || q.includes('đơn mẫu') || q.includes('phục vụ mẫu')) {
      return {
        text: `**Kịch bản bán hàng mẫu cho khách gọi Cafe:**\n\n1. Đầu tiên, bạn vào **Sơ đồ phòng bàn** từ Sidebar.\n2. Chọn **Bàn 101** ở Tầng 1.\n3. Gọi món: Chọn 1 ly **Cà phê Muối Sông Hồng (Mùa Thu)** giá 39k, và 1 đĩa **Bánh Tiramisu** giá 45k.\n4. Thử bấm gọi thêm 1 ly **Cà phê Muối Sông Hồng** nữa -> Bạn sẽ thấy đồ uống tự động gộp số lượng thành 2!\n5. Nhấn **Gửi Bếp/Bar** để ghi nhận order.\n6. Nhấn **Lưu tạm tính** để xuất hóa đơn nháp.\n7. Khách thanh toán: Bấm **Thanh toán**, quét mã VietQR tự sinh động theo số tiền cực tiện lợi, rồi nhấn **Hoàn thành**!\n\n*Thật đơn giản đúng không? Hãy thử ngay nhé!*`
      };
    }
    if (q.includes('khởi tạo') || q.includes('sạch dữ liệu') || q.includes('xóa hết') || q.includes('mới tinh') || q.includes('nhà hàng mới') || q.includes('reset')) {
      return {
        text: `Bạn muốn xóa sạch toàn bộ hóa đơn và order có sẵn để bắt đầu với một nhà hàng mới hoàn toàn?`,
        options: ['Đúng thế, hãy làm sạch dữ liệu ngay!'],
        action: 'reset_data'
      };
    }
    if (q.includes('làm sạch dữ liệu ngay') || q.includes('đúng thế, hãy làm sạch')) {
      return {
        text: `**Tuyệt vời! Hệ thống đã được đưa về trạng thái mới tinh (Clean Slate):**\n\n- Toàn bộ danh sách Order mẫu đã được xóa trống hoàn toàn.\n- Danh sách đặt chỗ (Reservations) đã sạch sẽ.\n- Danh sách hóa đơn điện tử trống trơn.\n- Sơ đồ 3 tầng 36 bàn được đưa về trạng thái trống hoàn toàn, sẵn sàng cho những vị khách đầu tiên của bạn!\n\n*Chúc quán Aroma Seasonal Coffee của bạn buôn may bán đắt!*`,
        action: 'trigger_reset'
      };
    }

    // Default Fallback Response
    return {
      text: `Chào bạn! Mình là trợ lý thông minh **MISA AVA** 🌸.\n\nỞ màn hình **${getScreenName(currentScreen)}** này, mình có thể giúp bạn các nghiệp vụ:\n- Thiết lập danh sách bàn, sơ đồ phòng ban 3 tầng linh hoạt.\n- Hướng dẫn ghi món (Order) gộp dòng đồ uống tự động cực kỳ tiện lợi.\n- Tư vấn quản lý dòng tiền, xuất hóa đơn điện tử e-Invoice chuẩn thông tư.\n\nBạn có thể chọn một trong các câu hỏi gợi ý bên dưới hoặc nhập câu hỏi của riêng bạn nhé!`,
      options: getSuggestedTopics(currentScreen)
    };
  };

  // On initial load or when screen changes, suggest welcome message
  useEffect(() => {
    const screenName = getScreenName(currentScreen);
    setMessages([
      {
        sender: 'ava',
        text: `Chào bạn! Mình là **MISA AVA** 🌸.\nBạn đang ở màn hình **${screenName}**.\n\nMình có thể hỗ trợ gì cho bạn tại đây? Dưới đây là các câu hỏi nhanh thường gặp:`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        options: getSuggestedTopics(currentScreen)
      }
    ]);
  }, [currentScreen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text, timestamp };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponseText(text);
      
      // Check special actions
      if (response.action === 'reset_data') {
        const avaMsg: Message = {
          sender: 'ava',
          text: response.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          options: response.options
        };
        setMessages(prev => [...prev, avaMsg]);
      } else if (response.action === 'trigger_reset') {
        if (onQuickReset) {
          onQuickReset();
        }
        const avaMsg: Message = {
          sender: 'ava',
          text: response.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          options: ['Hướng dẫn thiết lập ban đầu Quán Coffee?']
        };
        setMessages(prev => [...prev, avaMsg]);
      } else {
        const avaMsg: Message = {
          sender: 'ava',
          text: response.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          options: response.options || getSuggestedTopics(currentScreen)
        };
        setMessages(prev => [...prev, avaMsg]);
      }
      setIsTyping(false);
    }, 600);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <>
      {/* Floating Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
        {/* Animated Speech Notification bubble */}
        <AnimatePresence>
          {notification && !isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                setIsOpen(true);
                setNotification(null);
                handleSendMessage('Hướng dẫn thiết lập ban đầu Quán Coffee?');
              }}
              className="pointer-events-auto bg-slate-900 text-white text-xs py-2.5 px-4 rounded-2xl shadow-xl max-w-[260px] border border-slate-700/50 cursor-pointer flex items-start gap-2.5 relative mb-1.5"
            >
              <div className="w-5 h-5 rounded-full bg-[#076EFF] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 font-medium leading-relaxed">
                {notification}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNotification(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Little arrow pointing to FAB */}
              <div className="absolute right-5 -bottom-1.5 w-3 h-3 bg-slate-900 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setNotification(null);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-950/20 border-2 border-[#076EFF] relative group overflow-hidden"
          id="misa-ava-fab"
        >
          {/* Pulsing border effect */}
          <span className="absolute inset-0 rounded-full border border-white opacity-25 group-hover:scale-110 transition-transform duration-500"></span>
          <span className="absolute -inset-1 rounded-full bg-[#076EFF]/20 animate-ping duration-1000"></span>
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="sparkles"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Custom Avatar for Misa Ava */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-gradient-to-tr from-[#076EFF] to-cyan-400 flex items-center justify-center">
                  <span className="text-white text-xs font-black tracking-tighter">AVA</span>
                </div>
                <div className="absolute -bottom-1.5 bg-[#076EFF] text-[8px] font-black tracking-widest px-1 rounded uppercase text-white shadow">
                  AI
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Slide-out Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-[200] w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
              {/* Aesthetic background mesh glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#076EFF]/15 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#076EFF] to-cyan-400 flex items-center justify-center shadow-lg border border-white/15">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-wide uppercase text-white">MISA AVA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-normal">Trợ lý CUKCUK thông minh hỗ trợ 24/7</p>
                </div>
              </div>

              {/* Reset Data Button */}
              <button 
                onClick={() => handleSendMessage('Khởi tạo nhà hàng mới sạch dữ liệu?')}
                title="Làm mới dữ liệu ứng dụng"
                className="ml-auto mr-2 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats/Aroma Coffee Profile Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#076EFF]" />
                <span className="text-xs font-bold text-slate-700">Aroma Coffee</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" /> 3 Tầng (36 bàn)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> 5 Nhân viên
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                  {/* Sender name & time */}
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {msg.sender === 'user' ? 'Bạn' : 'Misa Ava'}
                    </span>
                    <span className="text-[8px] text-slate-400 font-normal">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Bubble content */}
                  <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm whitespace-pre-line leading-relaxed border ${
                    msg.sender === 'user' 
                      ? 'bg-[#076EFF] text-white border-[#076EFF] rounded-tr-none' 
                      : 'bg-white text-slate-800 border-slate-200/60 rounded-tl-none'
                  }`}>
                    {/* Render basic custom bold tags ** ** */}
                    {msg.text.split('\n').map((line, lIdx) => {
                      // Process bold text
                      const parts = line.split('**');
                      return (
                        <p key={lIdx} className={line.startsWith('*') ? 'text-xs text-[#076EFF] italic mt-1.5' : 'mb-1'}>
                          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-black text-slate-900">{part}</strong> : part)}
                        </p>
                      );
                    })}
                  </div>

                  {/* Suggestion pill options from Ava */}
                  {msg.sender === 'ava' && msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSendMessage(opt)}
                          className="bg-white hover:bg-blue-50 text-slate-700 hover:text-[#076EFF] border border-slate-200 hover:border-[#076EFF]/30 text-xs py-1.5 px-3 rounded-full shadow-sm font-medium transition-all text-left flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-[#076EFF] shrink-0" />
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Misa Ava</span>
                    <span className="text-[8px] text-slate-400 font-normal">Đang gõ...</span>
                  </div>
                  <div className="bg-white text-slate-500 border border-slate-200/60 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Area */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input 
                type="text" 
                placeholder="Nhập câu hỏi để Ava hướng dẫn bạn..." 
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-medium bg-slate-50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-[#076EFF] hover:bg-[#065ee6] disabled:bg-slate-100 disabled:text-slate-400 text-white flex items-center justify-center shadow-md transition-all shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
