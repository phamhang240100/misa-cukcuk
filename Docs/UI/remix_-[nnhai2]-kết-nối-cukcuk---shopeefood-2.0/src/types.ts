export interface Application {
  id: string;
  title: string;
  description: string;
  iconType: 'wave' | 'color-circle' | 'sme-circle' | 'diamond' | 'sms' | 'ahamove' | 'grab' | 'shopeefood' | 'api' | 'hotel';
  isConnected: boolean;
  category: string;
  imageUrl?: string;
  isNew?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  note?: string;
  itemsCount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  status: 'active' | 'inactive';
}

export interface SidebarMenuItem {
  id: string;
  title: string;
  iconName: string;
  hasArrow?: boolean;
  children?: string[];
  badgeBg?: string;
  isBadgeIcon?: boolean;
  sectionHeader?: string;
  hasPlusButton?: boolean;
  isDividerBefore?: boolean;
  logoUrl?: string;
}
