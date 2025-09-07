import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, ThumbsUp, Calendar } from "lucide-react";

const LeaderboardCard = ({ user, index, showFullInfo = true }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <div className="h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center">🥇</div>;
      case 2:
        return <div className="h-6 w-6 bg-gray-400 rounded-full flex items-center justify-center">🥈</div>;
      case 3:
        return <div className="h-6 w-6 bg-amber-600 rounded-full flex items-center justify-center">🥉</div>;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="border-border/40 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {getRankIcon(user.rank)}
            </div>
            
            {/* Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate text-sm sm:text-base">
                  {user.name}
                </h4>
                <Badge className={`${getLevelColor(user.level)} text-xs`}>
                  {user.level}
                </Badge>
              </div>
              
              {showFullInfo && (
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.issuesReported} issues
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {user.upvotesReceived} upvotes
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Since {user.joinedDate}
                  </span>
                </div>
              )}
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {user.points.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>

          {/* Badges (only show if full info is enabled) */}
          {showFullInfo && user.badges && user.badges.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-1">
                {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                  <Badge 
                    key={badgeIndex} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
                {user.badges.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.badges.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeaderboardCard;