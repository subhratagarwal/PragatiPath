import React from 'react';

export enum IssueStatus {
  Reported = 'Reported',
  Acknowledged = 'Acknowledged',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export enum IssueCategory {
  Pothole = 'Pothole',
  Streetlight = 'Broken Streetlight',
  Waste = 'Waste Management',
  Graffiti = 'Graffiti',
  PublicTransport = 'Public Transport',
  Other = 'Other',
}

export enum Department {
    PublicWorks = 'Public Works',
    Sanitation = 'Sanitation',
    ParksAndRec = 'Parks and Recreation',
    Transportation = 'Transportation',
    CodeEnforcement = 'Code Enforcement',
}


export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    timestamp: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  imageUrl?: string;
  address: string;
  reportedBy: string;
  reportedAt: Date;
  upvotes: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  timeline: {
    status: IssueStatus;
    date: Date;
    notes?: string;
  }[];
  comments?: Comment[];
  assignedDepartment?: Department;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock data only
  role: 'admin' | 'citizen';
  avatarUrl: string;
  points: number;
  rank: number;
  badges: Badge[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'citizen';
  avatarUrl: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}