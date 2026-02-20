import Link from "next/link";
import Image from "next/image";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/dist/server/request/headers";
import { redirect } from 'next/navigation';

const Layout=async ({children}:{children:React.ReactNode})=>{
    const auth = await getAuth();
    const session = await auth.api.getSession({headers: await headers()});
      if(session?.user) redirect("/");
    return (
      
      
      <main className="auth-layout">
        <section className="auth-left-section scrollbar-hide-default">
          <Link href="/" className="auth-logo">
            <Image
              src="/assets/icons/logo.svg"
              alt="Momentum Logo"
              width={180}
              height={54}
            />
          </Link>
          <div className="pb-6 lg:pb-8 flex-1">{children}</div>
        </section>

        <section className="auth-right-section">
          <div className="z-10 relative lg:mt-4 lg:mb-16">
            <blockquote className="auth-blockquote">
              “Momentum completely changed how I learn. I stopped jumping
              between random videos and finally started finishing what I begin.
              Seeing my progress grow every day keeps me motivated.”
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                <cite className="auth-testimonial-author">- Arghya C.</cite>
                <p className="max-md:text-xs text-gray-500">
                  Engineering Student
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    key={star}
                    width={20}
                    height={15}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <Image
              src="/authcover.png"
              alt="auth coverimage"
              width={1200}
              height={900}
              className="auth-dashboard-preview"
            />
          </div>
        </section>
      </main>
    );
}

export default Layout;