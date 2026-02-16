declare global{
  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
    dashboardUrl: string;
  };
  type WeeklyReportEmailData = {
    email: string;
    name: string;
    totalProjects: number;
    completedProjects: number;
    progress: number;
    dashboardUrl: string;
    aiMessage: string;
  };
}


export {};
