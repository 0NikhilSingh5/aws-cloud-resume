import { Footer2 } from "@/components/ui/footer2";

export function PortfolioFooter() {
  return (
    <Footer2
      logo={{
        url: "/",
        src: "/images/portfolio.png",
        alt: "Nikhil Singh",
        title: "Nikhil Singh",
      }}
      tagline="Cloud Engineer · AWS Specialist · India"
      menuItems={[
        {
          title: "Sections",
          links: [
            { text: "About", url: "/#about" },
            { text: "Experience", url: "/#experience" },
            { text: "Certifications", url: "/#certs" },
            { text: "Projects", url: "/#projects" },
            { text: "Contact", url: "/#contact" },
          ],
        },
        {
          title: "Roles",
          links: [
            { text: "Enetro AI", url: "/enetro" },
            { text: "Readywire", url: "/readywire" },
            { text: "TCS", url: "/tcs" },
          ],
        },
        {
          title: "Resume",
          links: [
            {
              text: "Download PDF",
              url: "https://pubartifacts-bkt.s3.ap-south-1.amazonaws.com/Nikhil_Singh_Resume.pdf",
            },
          ],
        },
        {
          title: "Social",
          links: [
            { text: "GitHub", url: "https://github.com/0NikhilSingh5" },
            {
              text: "LinkedIn",
              url: "https://www.linkedin.com/in/nikhilsingh08/",
            },
            { text: "X / Twitter", url: "https://x.com/itsyournickkk" },
            {
              text: "Instagram",
              url: "https://www.instagram.com/itsyournickk/",
            },
            {
              text: "WhatsApp",
              url: "https://wa.me/9027500166",
            },
          ],
        },
      ]}
      copyright={`© ${new Date().getFullYear()} Nikhil Singh. All rights reserved.`}
      bottomLinks={[
        { text: "0nikhilsingh5@gmail.com", url: "mailto:0nikhilsingh5@gmail.com" },
        { text: "+91 902 750 0166", url: "tel:+919027500166" },
      ]}
    />
  );
}
