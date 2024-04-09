import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import {
  JustSayinProject,
  HackDavisProject,
  SmallProject,
  LStoreProject,
} from './_components/ProjectComponents';

import JustSayinLogo from '@public/projects/JustSayin/JustSayin_Logo.svg';
import JustSayinContentImage from '@public/projects/JustSayin/JustSayin_Phone.png';

import HackDavisLogo from '@public/projects/HackDavis/HackDavis_White_Logo.svg';
import HackDavisContentImage from '@public/projects/HackDavis/HackDavis_homepage.png';

import DavisPNGLogo from '@public/projects/DavisPNG/DavisPNG_Logo.svg';
import DavisPNGContentImage from '@public/projects/DavisPNG/DavisPNG_Landing.svg';

// import ImageGPTContentImage from '@public/projects/ImageGPT/ImageGPT_Landing.svg';
import ImageGPTContentImage from '@public/projects/ImageGPT/ChatPage.jpeg';
import ImageGPTLogo from '@public/projects/ImageGPT/ImageGPT_Logo.svg';

import LStoreContentImage from '@public/projects/LStore/LStore_Diagram.svg';

export type ProjectItem = {
  title: string;
  type: string;
  description: string;
  descriptionTitle: string;
  github_repo: string;
  logo?: string | StaticImport;
  url: string;
  contentImage: string | StaticImport;
};

const ProjectList: ProjectItem[] = [
  {
    title: 'HACKDAVIS',
    type: 'WEB DEVELOPMENT',
    descriptionTitle: 'HackDavis Website',
    description:
      'Created a website for HackDavis 2024 to promote the event \
    and provide information for attendees. The website had a traffic \
    of 275,560 hits per month. With 8,300 unique visitors',
    github_repo: '',
    url: 'https://hackdavis.io/',
    logo: HackDavisLogo,
    contentImage: HackDavisContentImage,
  },
  {
    title: 'JUSTSAYIN',
    type: 'MOBILE DEVELOPMENT',
    descriptionTitle: 'JustSayin Mobile App',
    description:
      'Mobile application displaying daily quotes from your favorite authors on your lock screen widget',
    github_repo: 'https://github.com/winzamark123/JustSayin',
    logo: JustSayinLogo,
    contentImage: JustSayinContentImage,
    url: '',
  },
  {
    title: 'LSTORE',
    type: 'DATABASE MANAGEMENT SYSTEM',
    descriptionTitle: 'Lineage-based Data Store',
    description:
      'Implemented a Lineage-based Data Store (LStore) \
    which combines real-time processing of transactional and \
    analytical workloads ran with concurrency using update-friendly lineage-based storage architecture',
    github_repo: 'https://github.com/winzamark123/LStore_Database',
    url: 'https://github.com/winzamark123/LStore_Database',
    contentImage: LStoreContentImage,
  },
  {
    title: 'DAVISPNG',
    type: 'WEB DEVELOPMENT',
    descriptionTitle: 'DavisPNG Website',
    description:
      'A website marketplcae which matches student-photographers. \
    with clients. Focused on providing a platform for students. ',
    github_repo: 'https://github.com/winzamark123/DavisPNG_Frontend',
    url: 'https://davispng.com/',
    logo: DavisPNGLogo,
    contentImage: DavisPNGContentImage,
  },
  {
    title: 'IMAGEGPT',
    type: 'AI CHATBOT',
    descriptionTitle: 'ImageGPT AI Chatbot',
    description:
      'An AI Chatbot web application. \
    Providing users with the ability to upload images and receive text-based responses before GPT4 Multi-Modal',
    github_repo: 'https://github.com/hdjekso/imageGPT',
    contentImage: ImageGPTContentImage,
    logo: ImageGPTLogo,
    url: 'https://github.com/hdjekso/imageGPT',
  },
];

export default function Projects() {
  return (
    <main>
      <h1>Projects</h1>
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-6 text-gray-500">
          <div className="relative">
            <div className="relative z-10 grid grid-cols-6 gap-3">
              <div
                className="relative col-span-full overflow-hidden rounded-xl
              bg-gray-600 pl-5 text-white transition-colors duration-300
              ease-in-out hover:cursor-pointer hover:bg-cyan-900
              dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-cyan-900
              lg:col-span-6"
              >
                <HackDavisProject {...ProjectList[0]} />
              </div>

              <div
                className="relative col-span-full overflow-hidden rounded-xl 
              border border-gray-200 bg-gray-600 hover:bg-slate-700 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-slate-700 lg:col-span-4"
              >
                <LStoreProject {...ProjectList[2]} />
              </div>
              <div
                className="relative overflow-hidden rounded-xl border 
                border-gray-200 bg-gray-800 hover:bg-rose-500 dark:border-gray-800
                dark:bg-gray-900 dark:hover:bg-rose-500 lg:col-span-2 lg:row-span-2"
              >
                <JustSayinProject {...ProjectList[1]} />
              </div>
              <div
                className="relative overflow-hidden rounded-xl border border-gray-200 
              bg-gray-600 hover:bg-amber-700 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-amber-700 lg:col-span-2"
              >
                <SmallProject {...ProjectList[3]} />
              </div>
              <div
                className="relative overflow-hidden rounded-xl border border-gray-200 
              bg-gray-600 hover:bg-sky-600 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-sky-600 lg:col-span-2"
              >
                <SmallProject {...ProjectList[4]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
