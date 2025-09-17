import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  BriefcaseIcon, 
  FileText, 
  TrendingUp, 
  Clock, 
  Target,
  Search,
  Plus
} from "lucide-react";
import { mockKPIData, mockPipelineItems, mockJobPostings } from "@/lib/mockData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const kpiData = mockKPIData;
  const recentMatches = mockPipelineItems.slice(0, 3);
  const activeJobs = mockJobPostings.filter(job => job.status === 'active').slice(0, 3);

  const kpiCards = [
    {
      title: "Total Candidates",
      value: kpiData.totalCandidates.toLocaleString(),
      description: "Active in talent pool",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Jobs",
      value: kpiData.activeJobs.toString(),
      description: "Currently hiring",
      icon: BriefcaseIcon,
      color: "text-success"
    },
    {
      title: "Pending Offers",
      value: kpiData.pendingOffers.toString(),
      description: "Awaiting response",
      icon: FileText,
      color: "text-warning"
    },
    {
      title: "Hired This Month",
      value: kpiData.hiredThisMonth.toString(),
      description: "Successful placements",
      icon: TrendingUp,
      color: "text-success"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your recruiting overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/candidates">
              <Search className="w-4 h-4 mr-2" />
              Find Candidates
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/jobs">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Metrics Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Hiring Performance
            </CardTitle>
            <CardDescription>
              Key metrics for this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Average Time to Hire */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Time to Hire</span>
                <span className="text-sm text-muted-foreground">{kpiData.averageTimeToHire} days</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            {/* Conversion Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm text-muted-foreground">{kpiData.conversionRate}%</span>
              </div>
              <Progress value={kpiData.conversionRate} className="h-2" />
            </div>

            {/* Top Skills */}
            <div>
              <h4 className="text-sm font-medium mb-3">Most In-Demand Skills</h4>
              <div className="flex flex-wrap gap-2">
                {kpiData.topSkills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill.skill} ({skill.count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common recruiting tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/candidates">
                <Search className="w-4 h-4 mr-2" />
                Search Candidates
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/jobs">
                <Plus className="w-4 h-4 mr-2" />
                Create Job Posting
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/pipeline">
                <Users className="w-4 h-4 mr-2" />
                Manage Pipeline
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/reports">
                <FileText className="w-4 h-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Matches
              <Button asChild variant="ghost" size="sm">
                <Link to="/matches">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Latest candidate-job matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMatches.map((match) => (
              <div key={match.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={match.candidate.avatar} />
                  <AvatarFallback>
                    {match.candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{match.candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{match.jobTitle}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {match.matchScore}% match
                  </Badge>
                  <Badge variant={
                    match.stage === 'offer' ? 'default' : 
                    match.stage === 'interview' ? 'secondary' : 'outline'
                  }>
                    {match.stage}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Jobs
              <Button asChild variant="ghost" size="sm">
                <Link to="/jobs">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Currently open positions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{job.title}</h4>
                  <Badge variant="outline">{job.experienceLevel}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{job.companyName}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {job.applicationsCount}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d
                    </span>
                  </div>
                </div>
                <Progress value={(job.applicationsCount / 50) * 100} className="h-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}