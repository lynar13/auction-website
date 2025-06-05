export interface User {
    name: string;
    email?: string;
    [key: string]: any;
  }
  
  export interface Profile {
    name: string;
    credits: number;
    avatar?: {
      url: string;
      alt: string;
    };
    [key: string]: any;
  }
  
  export interface Listing {
    id: string;
    title: string;
    [key: string]: any;
  }
  