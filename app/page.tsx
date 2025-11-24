import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroCta } from "./_components/hero-cta";
import { 
  CheckCircle2, 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings, 
  FolderKanban,
  ListTodo,
  TrendingUp,
  Target,
  Zap,
  Shield,
  ChartNoAxesCombined
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Get a comprehensive overview of your tasks with statistics, productivity visualizations, and recent activity feed.",
      color: "bg-blue-100 text-blue-600 border border-blue-300 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/60"
    },
    {
      icon: ListTodo,
      title: "Task Management",
      description: "Create, edit, delete, and organize tasks. Mark them as complete and track every detail with ease.",
      color: "bg-purple-100 text-purple-600 border border-purple-300 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-800/60"
    },
    {
      icon: Calendar,
      title: "Calendar View",
      description: "Visualize tasks by due date on an interactive calendar. Click on any date to manage tasks for that day.",
      color: "bg-emerald-100 text-emerald-600 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/60"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Generate detailed activity reports and monitor your productivity trends at a glance.",
      color: "bg-orange-100 text-orange-600 border border-orange-300 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800/60"
    },
    {
      icon: FolderKanban,
      title: "Category Management",
      description: "Create custom categories to organize your work. Divide tasks for better clarity and focused reporting.",
      color: "bg-pink-100 text-pink-600 border border-pink-300 dark:bg-pink-900/40 dark:text-pink-400 dark:border-pink-800/60"
    },
    {
      icon: Settings,
      title: "Customizable Settings",
      description: "Tune your theme and personalize your account to meet your needs.",
      color: "bg-indigo-100 text-indigo-600 border border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800/60"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Stay Focused",
      description: "Keep your goals in sight with organized task views",
      color:
        "text-rose-600 bg-rose-100 border border-rose-300 dark:text-rose-300 dark:bg-rose-900/40 dark:border-rose-800/60"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visualize your productivity and celebrate achievements",
      color:
        "text-emerald-600 bg-emerald-100 border border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-800/60"
    },
    {
      icon: Zap,
      title: "Work Faster",
      description: "Streamlined workflows that save you time",
      color:
        "text-orange-600 bg-orange-100 border border-orange-300 dark:text-orange-300 dark:bg-orange-900/40 dark:border-orange-800/60"
    },
    {
      icon: Shield,
      title: "Never Forget",
      description: "Stay on schedule with clear status indicators and calendar highlights",
      color:
        "text-blue-600 bg-blue-100 border border-blue-300 dark:text-blue-300 dark:bg-blue-900/40 dark:border-blue-800/60"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="glow-accent">
            <Badge
              variant="secondary"
              className="relative px-4 py-2 border border-border/40 bg-background/80 backdrop-blur"
            >
              <ChartNoAxesCombined className="w-3 h-3 mr-1" />
              Your Productivity Tool for Success
            </Badge>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Master Your Tasks,
            <br />
            <span className="bg-clip-text text-transparent gradient-shine" data-text="Achieve Your Goals">
              Achieve Your Goals
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
            TaskMaster is a comprehensive task management system designed to help you handle tasks
            efficiently and achieve your goals faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <HeroCta />
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Dashboard insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Calendar views</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Data exports and reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-2">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Stay Productive
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete suite of tools designed to help you manage tasks efficiently
            and achieve your goals faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30 rounded-3xl my-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-2">Benefits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose TaskMaster?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${benefit.color}`}>
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TaskMaster</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
