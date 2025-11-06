import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
  Sparkles
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Get a comprehensive overview of your tasks with statistics, productivity visualizations, and recent activity feed.",
      color: "text-blue-500"
    },
    {
      icon: ListTodo,
      title: "Task Management",
      description: "Create, edit, delete, and organize tasks. Mark them as complete and track every detail with ease.",
      color: "text-purple-500"
    },
    {
      icon: Calendar,
      title: "Calendar View",
      description: "Visualize tasks by due date with monthly and weekly views. Click on any date to manage tasks for that day.",
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Generate detailed activity reports, export data, and monitor your weekly and monthly productivity trends.",
      color: "text-orange-500"
    },
    {
      icon: FolderKanban,
      title: "Category Management",
      description: "Create custom categories to organize your work. Divide tasks for better clarity and focused reporting.",
      color: "text-pink-500"
    },
    {
      icon: Settings,
      title: "Customizable Settings",
      description: "Personalize your experience with theme customization, notification preferences, and data management options.",
      color: "text-indigo-500"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Stay Focused",
      description: "Keep your goals in sight with organized task views"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visualize your productivity and celebrate achievements"
    },
    {
      icon: Zap,
      title: "Work Faster",
      description: "Streamlined workflows that save you time"
    },
    {
      icon: Shield,
      title: "Never Forget",
      description: "Smart reminders and notifications keep you on track"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Your Productivity Partner
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Master Your Tasks,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Achieve Your Goals
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            TaskMaster is a comprehensive task management system designed to help you handle tasks, 
            track progress, and gain insights through powerful dashboards and reports.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">
                Get Started
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Setup in minutes</span>
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
                <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 ${feature.color}`}>
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
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <benefit.icon className="h-8 w-8 text-primary" />
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
