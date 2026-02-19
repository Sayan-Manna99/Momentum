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

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };
  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };
}


export {};
