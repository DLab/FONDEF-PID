export class SidenavItem {
  name: string;
  id?:number;
  icon?: string;
  routeOrFunction?: any;
  parent?: SidenavItem;
  subItems?: SidenavItem[];
  position?: number;
  pathMatchExact?: boolean;
  badge?: string;
  badgeColor?: string;
  crumbs?: string[];
  lang_crumbs?: string[];
  type?: 'item' | 'subheading';
  customClass?: string;
}
