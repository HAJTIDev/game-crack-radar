
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  color: "green" | "red" | "blue";
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, color, icon }: StatsCardProps) => {
  const colorClasses = {
    green: {
      dot: "bg-green-400",
      text: "text-green-400"
    },
    red: {
      dot: "bg-red-400",
      text: "text-red-400"
    },
    blue: {
      dot: "bg-blue-400",
      text: "text-blue-400"
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          {title !== "Latest Crack" ? (
            <>
              <div className={`h-2 w-2 ${colorClasses[color].dot} rounded-full`}></div>
              <span className={`text-sm font-medium ${colorClasses[color].text}`}>{title}</span>
            </>
          ) : (
            <>
              {icon}
              <span className={`text-sm font-medium ${colorClasses[color].text}`}>{title}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
