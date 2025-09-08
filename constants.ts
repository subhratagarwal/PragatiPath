
import { User, Issue, IssueStatus, IssueCategory, Badge, Comment, Department } from './types';
import { ShieldCheckIcon, FireIcon, StarIcon, MapPinIcon } from './components/icons';

export const categoryColors: Record<IssueCategory, string> = {
  [IssueCategory.Pothole]: 'bg-red-500 border-red-300',
  [IssueCategory.Streetlight]: 'bg-yellow-500 border-yellow-300',
  [IssueCategory.Waste]: 'bg-green-500 border-green-300',
  [IssueCategory.Graffiti]: 'bg-purple-500 border-purple-300',
  [IssueCategory.PublicTransport]: 'bg-blue-500 border-blue-300',
  [IssueCategory.Other]: 'bg-gray-500 border-gray-300',
};

export const categoryToDepartmentMap: Record<IssueCategory, Department | undefined> = {
  [IssueCategory.Pothole]: Department.PublicWorks,
  [IssueCategory.Streetlight]: Department.PublicWorks,
  [IssueCategory.Waste]: Department.Sanitation,
  [IssueCategory.Graffiti]: Department.CodeEnforcement,
  [IssueCategory.PublicTransport]: Department.Transportation,
  [IssueCategory.Other]: undefined, // Requires manual assignment
};

export const badges: Badge[] = [
  { id: 'b1', name: 'Neighborhood Guardian', description: 'Reported 10+ valid issues.', icon: ShieldCheckIcon },
  { id: 'b2', name: 'Early Responder', description: 'First to report 5 issues.', icon: FireIcon },
  { id: 'b3', name: 'Community Star', description: 'Reached 1000 points.', icon: StarIcon },
  { id: 'b4', name: 'Local Explorer', description: 'Reported issues in 5 different zones.', icon: MapPinIcon },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'admin@test.com', password: 'password', role: 'admin', avatarUrl: 'https://picsum.photos/seed/alice/100', points: 2350, rank: 1, badges: [badges[0], badges[2], badges[3]] },
  { id: 'u2', name: 'Bob Williams', email: 'bob@test.com', password: 'password', role: 'citizen', avatarUrl: 'https://picsum.photos/seed/bob/100', points: 2100, rank: 2, badges: [badges[0], badges[1]] },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@test.com', password: 'password', role: 'citizen', avatarUrl: 'https://picsum.photos/seed/charlie/100', points: 1980, rank: 3, badges: [badges[0]] },
  { id: 'u4', name: 'Diana Prince', email: 'diana@test.com', password: 'password', role: 'citizen', avatarUrl: 'https://picsum.photos/seed/diana/100', points: 1750, rank: 4, badges: [badges[1]] },
  { id: 'u5', name: 'Ethan Hunt', email: 'ethan@test.com', password: 'password', role: 'citizen', avatarUrl: 'https://picsum.photos/seed/ethan/100', points: 1500, rank: 5, badges: [] },
];

const mockComments: Comment[] = [
    { id: 'c1', author: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/bob/100', text: "I hit this yesterday, it's really bad! Thanks for reporting.", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'c2', author: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/100', text: "Agreed, this needs urgent attention.", timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000) },
];

export const mockIssues: Issue[] = [
  {
    id: 'i1',
    title: 'Massive Pothole on Main St',
    description: 'A large and dangerous pothole near the intersection of Main St and 1st Ave. It has already damaged a car. The pothole is approximately 3 feet wide and several inches deep, making it a significant hazard for all vehicles, especially at night or during rain when it is less visible.',
    category: IssueCategory.Pothole,
    status: IssueStatus.Acknowledged,
    imageUrl: 'https://picsum.photos/seed/pothole1/800/600',
    address: '123 Main St, Anytown',
    reportedBy: 'Alice Johnson',
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    upvotes: 128,
    priority: 'Critical',
    timeline: [
      { status: IssueStatus.Reported, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Initial report with photo submitted.' },
      { status: IssueStatus.Acknowledged, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Team assigned. Scheduled for repair within 48 hours.' },
    ],
    comments: mockComments,
    assignedDepartment: Department.PublicWorks,
  },
  {
    id: 'i2',
    title: 'Streetlight out at Oak Park',
    description: 'The streetlight at the park entrance has been out for a week. It is very dark and feels unsafe at night. This is a high-traffic pedestrian area, and the lack of light is a safety concern for residents visiting the park after sunset.',
    category: IssueCategory.Streetlight,
    status: IssueStatus.Resolved,
    imageUrl: 'https://picsum.photos/seed/light1/800/600',
    address: '456 Oak Ave, Anytown',
    reportedBy: 'Bob Williams',
    reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    upvotes: 75,
    priority: 'High',
    timeline: [
        { status: IssueStatus.Reported, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), notes: 'Citizen reported outage.' },
        { status: IssueStatus.Acknowledged, date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), notes: 'Acknowledged by the city electrical department.' },
        { status: IssueStatus.InProgress, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: 'Crew dispatched for repair.' },
        { status: IssueStatus.Resolved, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Bulb replaced and tested. Issue resolved.' },
    ],
    comments: [],
    assignedDepartment: Department.PublicWorks,
  },
  {
    id: 'i3',
    title: 'Overflowing bins at City Market',
    description: 'The public waste bins at the city market are overflowing, attracting pests and creating a mess. This has been a recurring problem every weekend.',
    category: IssueCategory.Waste,
    status: IssueStatus.Reported,
    imageUrl: 'https://picsum.photos/seed/waste1/800/600',
    address: '789 Market St, Anytown',
    reportedBy: 'Charlie Brown',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    upvotes: 42,
    priority: 'Medium',
    timeline: [
      { status: IssueStatus.Reported, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Initial report submitted.' },
    ],
    comments: [
        { id: 'c3', author: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/100', text: "Yes! It smells terrible. Hope this gets cleaned up soon.", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    ],
    assignedDepartment: Department.Sanitation,
  },
];
