import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  TrendingUp,
  MapPin,
  CheckCircle,
  ThumbsUp
} from "lucide-react";

const users = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/api/placeholder/64/64",
    points: 2847,
    rank: 1,
    issuesReported: 23,
    upvotesReceived: 156,
    badges: ["Community Champion", "First Reporter", "Problem Solver"],
    joinedDate: "Jan 2024",
    level: "Civic Hero"
  },
  {
    id: "2", 
    name: "Mike Chen",
    avatar: "/api/placeholder/64/64",
    points: 2234,
    rank: 2,
    issuesReported: 18,
    upvotesReceived: 128,
    badges: ["Quality Reporter", "Neighborhood Guardian"],
    joinedDate: "Feb 2024",
    level: "Community Leader"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/api/placeholder/64/64",
    points: 1876,
    rank: 3,
    issuesReported: 15,
    upvotesReceived: 94,
    badges: ["Early Adopter", "Detail Oriented"],
    joinedDate: "Mar 2024",
    level: "Active Citizen"
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/api/placeholder/64/64",
    points: 1654,
    rank: 4,
    issuesReported: 21,
    upvotesReceived: 87,
    badges: ["Accessibility Advocate", "Frequent Contributor"],
    joinedDate: "Jan 2024",
    level: "Active Citizen"
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "/api/placeholder/64/64",
    points: 1432,
    rank: 5,
    issuesReported: 12,
    upvotesReceived: 76,
    badges: ["Quality First", "Team Player"],
    joinedDate: "Apr 2024",
    level: "Engaged Resident"
  },
  {
    id: "6",
    name: "James Thompson",
    avatar: "/api/placeholder/64/64",
    points: 1298,
    rank: 6,
    issuesReported: 16,
    upvotesReceived: 65,
    badges: ["Safety First", "Quick Reporter"],
    joinedDate: "Feb 2024",
    level: "Engaged Resident"
  }
];

const availableBadges = [
  {
    id: "1",
    name: "Community Champion",
    description: "Top contributor for 3 consecutive months",
    icon: "🏆",
    color: "text-yellow-600"
  },
  {
    id: "2", 
    name: "First Reporter",
    description: "First to report an issue in your area",
    icon: "🥇",
    color: "text-blue-600"
  },
  {
    id: "3",
    name: "Problem Solver",
    description: "Reported 20+ issues that were successfully resolved",
    icon: "⚡",
    color: "text-green-600"
  },
  {
    id: "4",
    name: "Quality Reporter",
    description: "90%+ of reports include detailed descriptions and photos",
    icon: "📸",
    color: "text-purple-600"
  },
  {
    id: "5",
    name: "Neighborhood Guardian",
    description: "Consistently reports issues in your local area",
    icon: "🏘️",
    color: "text-indigo-600"
  }
];

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getLevelColor = (level) => {
  switch (level) {
    case "Civic Hero":
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
    case "Community Leader":
      return "bg-gradient-to-r from-blue-500 to-purple-500 text-white";
    case "Active Citizen":
      return "bg-gradient-to-r from-green-500 to-blue-500 text-white";
    case "Engaged Resident":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Community Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating citizens who make our community better through civic engagement.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {/* Top 3 Podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <Card className="border-border/40 overflow-hidden">
                <CardHeader className="bg-gradient-hero text-white">
                  <CardTitle className="text-center text-2xl">
                    Top Contributors This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-center items-end gap-6">
                    {users.slice(0, 3).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className={`text-center ${index === 0 ? 'order-2 md:order-2' : index === 1 ? 'order-1 md:order-1' : 'order-3 md:order-3'}`}
                      >
                        <div className={`relative mb-4 ${index === 0 ? 'scale-110' : ''}`}>
                          <Avatar className={`mx-auto ${index === 0 ? 'h-20 w-20' : 'h-16 w-16'} border-4 ${index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-amber-600'}`}>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2">
                            {getRankIcon(user.rank)}
                          </div>
                        </div>
                        <h3 className={`font-bold ${index === 0 ? 'text-lg' : 'text-base'} mb-1`}>
                          {user.name}
                        </h3>
                        <Badge className={getLevelColor(user.level)}>
                          {user.level}
                        </Badge>
                        <div className={`text-2xl font-bold text-primary mt-2 ${index === 0 ? 'text-3xl' : ''}`}>
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Full Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                        className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 text-center">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate">{user.name}</h4>
                            <Badge className={`${getLevelColor(user.level)} text-xs`}>
                              {user.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.issuesReported} issues
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {user.upvotesReceived} upvotes
                            </span>
                            <span className="hidden sm:inline">
                              Since {user.joinedDate}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {user.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Available Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${badge.color} mb-1`}>
                          {badge.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* How Points Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    How Points Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Report an issue</span>
                    <Badge variant="outline">+50 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Issue gets resolved</span>
                    <Badge variant="outline">+100 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Receive an upvote</span>
                    <Badge variant="outline">+10 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Add photo evidence</span>
                    <Badge variant="outline">+25 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First to report in area</span>
                    <Badge variant="outline">+75 pts</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}